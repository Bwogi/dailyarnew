// components/duty-form.tsx
"use client";
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSTS, DutyLog } from "@/types";

interface DutyFormProps {
  onDutyUpdate: () => void;
}

export function DutyForm({ onDutyUpdate }: DutyFormProps) {
  const [name, setName] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeDuty, setActiveDuty] = useState<DutyLog | null>(null);
  const { toast } = useToast();

  const checkActiveDuty = useCallback(
    async (userName: string) => {
      try {
        const response = await fetch("/api/log");
        const data = (await response.json()) as {
          success: boolean;
          logs: DutyLog[];
        };
        if (data.success) {
          const active = data.logs.find(
            (log) => log.status === "active" && log.name === userName
          );
          if (active) {
            setActiveDuty(active);
            setPost(active.post);
            setBadgeNumber(active.badgeNumber);
          } else {
            setActiveDuty(null);
          }
        }
      } catch {
        console.error("Error checking active duty");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check active duty status",
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    if (name) {
      checkActiveDuty(name);
    }
  }, [name, checkActiveDuty]);

  const handleStartDuty = async () => {
    if (!name.trim() || !badgeNumber.trim() || !post) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          badgeNumber: badgeNumber.trim(),
          post,
          type: "start",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Duty started",
        });
        checkActiveDuty(name);
        onDutyUpdate();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to start duty",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndDuty = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          type: "end",
          incidents: [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Duty ended",
        });
        setActiveDuty(null);
        setName("");
        setBadgeNumber("");
        setPost("");
        onDutyUpdate();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to end duty",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duty & Activity Logger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none"
              >
                Name
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={isLoading || activeDuty !== null}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="badgeNumber"
                className="text-sm font-medium leading-none"
              >
                Badge Number
              </label>
              <Input
                type="text"
                id="badgeNumber"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="Enter badge number"
                disabled={isLoading || activeDuty !== null}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="post"
                className="text-sm font-medium leading-none"
              >
                Post
              </label>
              <Select
                value={post}
                onValueChange={setPost}
                disabled={isLoading || activeDuty !== null}
              >
                <SelectTrigger id="post" className="w-full">
                  <SelectValue placeholder="Select a post" />
                </SelectTrigger>
                <SelectContent>
                  {POSTS.map((postOption) => (
                    <SelectItem key={postOption} value={postOption}>
                      {postOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeDuty ? (
            <Button
              onClick={handleEndDuty}
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "End Duty"}
            </Button>
          ) : (
            <Button
              onClick={handleStartDuty}
              className="w-full"
              disabled={
                isLoading || !name.trim() || !badgeNumber.trim() || !post
              }
            >
              {isLoading ? "Processing..." : "Start Duty"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
