// app/api/log/route.ts
import { MongoClient, UpdateFilter, ObjectId } from "mongodb";
import { Post, POSTS, Incident } from "@/types";

const uri = process.env.MONGODB_URI;

interface AddIncidentPayload {
  name: string;
  type: "add-incident";
  incident: Incident;
}

interface RemoveIncidentPayload {
  name: string;
  type: "remove-incident";
  incidentId: string;
}

interface StartDutyPayload {
  name: string;
  badgeNumber: string;
  post: Post;
  type: "start";
}

interface EndDutyPayload {
  name: string;
  type: "end";
}

type RequestPayload =
  | StartDutyPayload
  | EndDutyPayload
  | AddIncidentPayload
  | RemoveIncidentPayload;

interface DutyLog {
  _id?: ObjectId;
  name: string;
  badgeNumber: string;
  post: Post;
  startTime: Date;
  endTime: Date | null;
  status: "active" | "completed";
  incidents: Incident[];
}

export async function POST(request: Request) {
  let client: MongoClient | null = null;

  try {
    const payload = (await request.json()) as RequestPayload;
    client = await MongoClient.connect(uri as string);
    const db = client.db("userLogs");
    const collection = db.collection<DutyLog>("logs");

    switch (payload.type) {
      case "start": {
        const existingDuty = await collection.findOne({
          name: payload.name,
          status: "active",
        });

        if (existingDuty) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "User already has an active duty",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        if (!POSTS.includes(payload.post)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Invalid post selection",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const newDuty: Omit<DutyLog, "_id"> = {
          name: payload.name,
          badgeNumber: payload.badgeNumber,
          post: payload.post,
          startTime: new Date(),
          endTime: null,
          status: "active",
          incidents: [],
        };

        const result = await collection.insertOne(newDuty);

        return new Response(
          JSON.stringify({
            success: true,
            id: result.insertedId,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      case "add-incident": {
        const updateDoc: UpdateFilter<DutyLog> = {
          $push: {
            incidents: payload.incident,
          },
        };

        const result = await collection.updateOne(
          { name: payload.name, status: "active" },
          updateDoc
        );

        if (result.matchedCount === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "No active duty found",
            }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        if (result.modifiedCount === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Failed to add incident",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      case "remove-incident": {
        const updateDoc: UpdateFilter<DutyLog> = {
          $pull: {
            incidents: { id: payload.incidentId },
          },
        };

        const result = await collection.updateOne(
          { name: payload.name, status: "active" },
          updateDoc
        );

        if (result.matchedCount === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "No active duty found",
            }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        if (result.modifiedCount === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Failed to remove incident or incident not found",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      case "end": {
        const activeLog = await collection.findOne({
          name: payload.name,
          status: "active",
        });

        if (!activeLog) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "No active duty found",
            }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        const updateDoc: UpdateFilter<DutyLog> = {
          $set: {
            endTime: new Date(),
            status: "completed" as const,
          },
        };

        const result = await collection.updateOne(
          { _id: activeLog._id },
          updateDoc
        );

        if (result.modifiedCount === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Failed to end duty",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      default: {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid operation type",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function GET() {
  let client: MongoClient | null = null;

  try {
    client = await MongoClient.connect(uri as string);
    const db = client.db("userLogs");
    const collection = db.collection<DutyLog>("logs");

    const logs = await collection.find().sort({ startTime: -1 }).toArray();

    return new Response(
      JSON.stringify({
        success: true,
        logs,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
