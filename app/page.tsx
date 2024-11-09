import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FileText,
  Shield,
  Users,
  LayoutDashboard,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl text-indigo-600 text-bold mb-6">
            Daily Activity Reports & Duty Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your security operations with our comprehensive duty
            logging and incident reporting system.
          </p>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8" variant="secondary">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/reports">
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-indigo-400 text-white transition-colors"
              >
                View Reports
                <FileText className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="glass-card hover-scale">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl mb-2">Real-time Logging</h3>
                <p className="text-gray-600">
                  Accurate duty tracking with start and end times for all
                  security personnel.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-indigo-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl mb-2">Incident Reporting</h3>
                <p className="text-gray-600">
                  Comprehensive incident documentation with location and action
                  tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl mb-2">Post Management</h3>
                <p className="text-gray-600">
                  Efficient assignment and tracking of security posts across
                  facilities.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-green-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl mb-2">Active Monitoring</h3>
                <p className="text-gray-600">
                  Real-time visibility of active duties and security coverage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card text-center hover-scale">
              <CardContent className="pt-6">
                <div className="text-4xl text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600">Continuous Operation</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center hover-scale">
              <CardContent className="pt-6">
                <div className="text-4xl text-indigo-600 mb-2">100%</div>
                <p className="text-gray-600">Coverage Tracking</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center hover-scale">
              <CardContent className="pt-6">
                <div className="text-4xl text-purple-600 mb-2">Real-time</div>
                <p className="text-gray-600">Incident Reporting</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-blue-100 to-indigo-100 ">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 opacity-90">
            Start managing your security operations more effectively today.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="bg-indigo-400 text-white px-8"
              >
                Access Dashboard
                <LayoutDashboard className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/reports">
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-transparent border-white bg-white text-blue-600 transition-colors"
              >
                View Reports
                <FileText className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Activity Report & Duty Management
            System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
