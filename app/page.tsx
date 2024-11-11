// app/page.tsx
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
  Pen,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Daily Activity Reporting System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your security operations with our comprehensive duty
            logging and incident reporting system.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/duty-logger">
              <Button size="lg" className="px-8">
                Start Logging
                <Pen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8">
                View Dashboard
                <LayoutDashboard className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Real-time Logging
                </h3>
                <p className="text-gray-600">
                  Track duty hours and monitor active shifts with precise timing
                  and status updates.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-indigo-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Incident Reporting
                </h3>
                <p className="text-gray-600">
                  Document and manage incidents with detailed reporting and
                  immediate response tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Post Management</h3>
                <p className="text-gray-600">
                  Efficiently manage security posts and track officer
                  assignments across locations.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-green-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Active Monitoring
                </h3>
                <p className="text-gray-600">
                  Real-time visibility of security coverage and incident
                  management status.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  24/7
                </div>
                <p className="text-gray-600">Continuous Operation</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  100%
                </div>
                <p className="text-gray-600">Coverage Tracking</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  Real-time
                </div>
                <p className="text-gray-600">Incident Reporting</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start managing your security operations more effectively today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/duty-logger">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 hover:bg-white hover:text-blue-600 transition-colors"
              >
                Start Logging
                <Pen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/reports">
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-transparent border-white text-white hover:bg-white hover:text-blue-600 transition-colors"
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
            © {new Date().getFullYear()} Duty Management System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
