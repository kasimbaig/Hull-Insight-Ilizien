import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hull-neutral">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-hull-accent/10">
            <ExclamationTriangleIcon className="h-12 w-12 text-hull-accent" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">404</CardTitle>
          <CardDescription className="text-lg">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground">
            Requested path: <code className="bg-hull-secondary px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
          <Button 
            onClick={() => window.location.href = '/'} 
            className="bg-hull-primary hover:bg-hull-primary-dark w-full"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
