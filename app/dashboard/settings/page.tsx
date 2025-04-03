"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Lock, Moon, Sun, User } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    theme: "system",
    notifications: {
      email: true,
      push: true,
      inApp: true,
      digest: true,
    },
    privacy: {
      profileVisibility: "public",
      goalVisibility: "friends",
      activityVisibility: "private",
    },
  })

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement settings update
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">
            <User className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how GoalKeeper looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred theme
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={settings.theme === "dark"}
                    onCheckedChange={() =>
                      setSettings((prev) => ({
                        ...prev,
                        theme: prev.theme === "dark" ? "light" : "dark",
                      }))
                    }
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "email" as const,
                  label: "Email Notifications",
                  description: "Receive updates via email",
                },
                {
                  key: "push" as const,
                  label: "Push Notifications",
                  description: "Get notified on your device",
                },
                {
                  key: "inApp" as const,
                  label: "In-App Notifications",
                  description: "See notifications within the app",
                },
                {
                  key: "digest" as const,
                  label: "Weekly Digest",
                  description: "Get a summary of your progress",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    id={item.key}
                    checked={settings.notifications[item.key]}
                    onCheckedChange={() => handleNotificationChange(item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your activity and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "profileVisibility",
                  label: "Profile Visibility",
                  description: "Who can see your profile",
                  options: ["public", "friends", "private"],
                },
                {
                  key: "goalVisibility",
                  label: "Goal Visibility",
                  description: "Default visibility for new goals",
                  options: ["public", "friends", "private"],
                },
                {
                  key: "activityVisibility",
                  label: "Activity Visibility",
                  description: "Who can see your activity",
                  options: ["public", "friends", "private"],
                },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <Label>{item.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="flex gap-2">
                    {item.options.map((option) => (
                      <Button
                        key={option}
                        variant={
                          settings.privacy[
                            item.key as keyof typeof settings.privacy
                          ] === option
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            privacy: {
                              ...prev.privacy,
                              [item.key]: option,
                            },
                          }))
                        }
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
} 