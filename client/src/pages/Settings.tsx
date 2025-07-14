import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  // State for general settings
  const [companyName, setCompanyName] = useState("AI HRMS Corp");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [language, setLanguage] = useState("English");
  const handleSave = () => {
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("companyTimezone", timezone);
    localStorage.setItem("companyLanguage", language);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your AI HRMS system preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Your Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select id="timezone" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring hrms-gradient bg-white text-gray-900" value={timezone} onChange={e => setTimezone(e.target.value)}>
                  <option value="Pacific/Midway">(UTC-11:00) Midway Island</option>
                  <option value="Pacific/Honolulu">(UTC-10:00) Hawaii</option>
                  <option value="America/Anchorage">(UTC-09:00) Alaska</option>
                  <option value="America/Los_Angeles">(UTC-08:00) Pacific Time (US & Canada)</option>
                  <option value="America/Denver">(UTC-07:00) Mountain Time (US & Canada)</option>
                  <option value="America/Chicago">(UTC-06:00) Central Time (US & Canada)</option>
                  <option value="America/New_York">(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option value="America/Caracas">(UTC-04:30) Caracas</option>
                  <option value="America/Halifax">(UTC-04:00) Atlantic Time (Canada)</option>
                  <option value="America/St_Johns">(UTC-03:30) Newfoundland</option>
                  <option value="America/Argentina/Buenos_Aires">(UTC-03:00) Buenos Aires</option>
                  <option value="Atlantic/Azores">(UTC-01:00) Azores</option>
                  <option value="Europe/London">(UTC+00:00) London, Lisbon, Casablanca</option>
                  <option value="Europe/Berlin">(UTC+01:00) Berlin, Rome, Paris, Madrid</option>
                  <option value="Europe/Athens">(UTC+02:00) Athens, Bucharest, Istanbul</option>
                  <option value="Europe/Moscow">(UTC+03:00) Moscow, St. Petersburg</option>
                  <option value="Asia/Dubai">(UTC+04:00) Abu Dhabi, Muscat</option>
                  <option value="Asia/Karachi">(UTC+05:00) Islamabad, Karachi, Tashkent</option>
                  <option value="Asia/Dhaka">(UTC+06:00) Dhaka, Astana</option>
                  <option value="Asia/Bangkok">(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                  <option value="Asia/Hong_Kong">(UTC+08:00) Beijing, Hong Kong, Singapore</option>
                  <option value="Asia/Tokyo">(UTC+09:00) Tokyo, Seoul, Osaka, Sapporo</option>
                  <option value="Australia/Sydney">(UTC+10:00) Sydney, Melbourne, Brisbane</option>
                  <option value="Pacific/Auckland">(UTC+12:00) Auckland, Wellington, Fiji</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Input id="language" placeholder="Select language" value={language} onChange={e => setLanguage(e.target.value)} />
              </div>
              <Button className="hrms-gradient" onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch id="emailNotifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive browser push notifications</p>
                </div>
                <Switch id="pushNotifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="aiInsights">AI Insights</Label>
                  <p className="text-sm text-gray-500">Get AI-powered recommendations</p>
                </div>
                <Switch id="aiInsights" defaultChecked />
              </div>
              <Button className="hrms-gradient">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Switch id="twoFactor" />
              </div>
              <Button className="hrms-gradient">Update Security</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoApprovals">Auto-approve Claims</Label>
                  <p className="text-sm text-gray-500">Let AI automatically approve small claims</p>
                </div>
                <Switch id="autoApprovals" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smartScheduling">Smart Scheduling</Label>
                  <p className="text-sm text-gray-500">AI-powered meeting and leave scheduling</p>
                </div>
                <Switch id="smartScheduling" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidenceThreshold">AI Confidence Threshold</Label>
                <Input id="confidenceThreshold" type="number" min="0" max="100" defaultValue="85" />
                <p className="text-sm text-gray-500">Minimum confidence level for AI decisions (0-100%)</p>
              </div>
              <Button className="hrms-gradient">Save AI Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="groqApiKey">Groq API Key</Label>
                <Input id="groqApiKey" type="password" placeholder="gsk-..." />
                <p className="text-sm text-gray-500">Required for AI features (Groq)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupSchedule">Backup Schedule</Label>
                <Input id="backupSchedule" placeholder="Daily at 2:00 AM" defaultValue="Daily at 2:00 AM" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Enable for system updates</p>
                </div>
                <Switch id="maintenanceMode" />
              </div>
              <Button className="hrms-gradient">Update System</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}