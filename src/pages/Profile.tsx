import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Heart,
  Settings,
  Shield,
  CreditCard,
  Bell,
  Globe,
  Camera,
  Edit3,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Travel enthusiast and digital nomad. Love exploring new cultures and hidden gems around the world.",
    joinDate: "March 2023",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  });

  const stats = [
    { label: "Trips completed", value: "12" },
    { label: "Reviews written", value: "8" },
    { label: "Years hosting", value: "2" },
    { label: "Average rating", value: "4.9" },
  ];

  const recentBookings = [
    {
      id: 1,
      property: "Modern apartment in Dubai",
      location: "Downtown Dubai",
      date: "Dec 15-20, 2023",
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      property: "Luxury villa in Riyadh",
      location: "King Fahd District",
      date: "Nov 8-12, 2023",
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      property: "Desert resort experience",
      location: "Edge of Riyadh",
      date: "Jan 5-8, 2024",
      status: "Upcoming",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=100&h=100&fit=crop",
    },
  ];

  const favorites = [
    {
      id: 1,
      name: "Entire villa in Riyadh",
      location: "King Fahd District",
      price: 284,
      rating: 4.95,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop",
    },
    {
      id: 2,
      name: "Luxury penthouse with city view",
      location: "Kingdom Centre",
      price: 445,
      rating: 4.92,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=150&h=150&fit=crop",
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main
        className="w-full py-8 px-6 pt-header-plus-15"
        style={{
          paddingTop: "calc(var(--header-height-default) + 31px + 14px)",
        }}
      >
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4">{profile.bio}</p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {profile.joinDate}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                    4.9 rating
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mt-8 pt-8 border-t">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <img
                        src={booking.image}
                        alt={booking.property}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{booking.property}</h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date}
                        </p>
                      </div>
                      <Badge
                        variant={
                          booking.status === "Completed"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{property.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {property.location}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                            <span className="text-sm">{property.rating}</span>
                          </div>
                          <span className="font-semibold">
                            ${property.price}/night
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You haven't written any reviews yet.
                  </p>
                  <Button className="mt-4">Write Your First Review</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-3" />
                        <span>Notifications</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-3" />
                        <span>Privacy & Safety</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-3" />
                        <span>Payment Methods</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-3" />
                        <span>Language & Region</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
