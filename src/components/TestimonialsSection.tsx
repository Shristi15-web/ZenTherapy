import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Quote,
  ThumbsUp,
  Filter,
  Plus,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  testimonials,
  reviewStats,
  getTestimonialsByService,
  getTestimonialsByTherapist,
  getHighRatedTestimonials,
  getRecentTestimonials,
} from "@/data/testimonials.js";
import { therapyServices } from "@/data/services.js";
import { therapists } from "@/data/therapists.js";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const TestimonialsSection = () => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    patientName: "",
    rating: 5,
    title: "",
    review: "",
    serviceName: "",
    therapistName: "",
    location: "",
  });

  const { toast } = useToast();

  // Filter testimonials based on selected criteria
  const filteredTestimonials = React.useMemo(() => {
    let filtered = testimonials;

    if (filter !== "all") {
      if (filter.startsWith("service-")) {
        const serviceId = filter.replace("service-", "");
        filtered = getTestimonialsByService(serviceId);
      } else if (filter.startsWith("therapist-")) {
        const therapistId = filter.replace("therapist-", "");
        filtered = getTestimonialsByTherapist(therapistId);
      } else if (filter === "high-rated") {
        filtered = getHighRatedTestimonials(5);
      } else if (filter === "recent") {
        filtered = getRecentTestimonials(10);
      }
    }

    // Sort testimonials
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "helpful":
          return b.helpful - a.helpful;
        case "recent":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [filter, sortBy]);

  const handleAddReview = () => {
    if (!newReview.patientName || !newReview.title || !newReview.review) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to a database
    // For now, we'll just show a success message
    toast({
      title: "Review Submitted!",
      description:
        "Thank you for your feedback. Your review will be published after verification.",
    });

    setNewReview({
      patientName: "",
      rating: 5,
      title: "",
      review: "",
      serviceName: "",
      therapistName: "",
      location: "",
    });
    setShowAddReview(false);
  };

  const TestimonialCard = ({ testimonial }) => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {testimonial.patientInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{testimonial.patientName}</h4>
                {testimonial.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {testimonial.location}
                <span>•</span>
                <Calendar className="w-3 h-3" />
                {format(new Date(testimonial.date), "MMM yyyy")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-lg mb-2">{testimonial.title}</h3>
          <blockquote className="text-muted-foreground leading-relaxed">
            <Quote className="w-4 h-4 inline mr-1 text-primary" />
            {testimonial.review}
          </blockquote>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{testimonial.serviceName}</Badge>
          <Badge variant="outline">{testimonial.therapistName}</Badge>
          {testimonial.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Before:</span>
              <ul className="mt-1">
                {testimonial.beforeSymptoms?.slice(0, 2).map((symptom, i) => (
                  <li key={i} className="text-red-600 text-xs">
                    • {symptom}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-muted-foreground">After:</span>
              <ul className="mt-1">
                {testimonial.afterResults?.slice(0, 2).map((result, i) => (
                  <li key={i} className="text-green-600 text-xs">
                    • {result}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ThumbsUp className="w-4 h-4 mr-1" />
            Helpful ({testimonial.helpful})
          </Button>
          <span className="text-xs text-muted-foreground">
            Age {testimonial.age}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const AddReviewForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientName">Your Name *</Label>
          <Input
            id="patientName"
            value={newReview.patientName}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, patientName: e.target.value }))
            }
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={newReview.location}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, location: e.target.value }))
            }
            placeholder="City, State"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="serviceName">Service Received</Label>
          <Select
            value={newReview.serviceName}
            onValueChange={(value) =>
              setNewReview((prev) => ({ ...prev, serviceName: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {therapyServices.map((service) => (
                <SelectItem key={service.id} value={service.name}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="therapistName">Therapist</Label>
          <Select
            value={newReview.therapistName}
            onValueChange={(value) =>
              setNewReview((prev) => ({ ...prev, therapistName: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select therapist" />
            </SelectTrigger>
            <SelectContent>
              {therapists.map((therapist) => (
                <SelectItem key={therapist.id} value={therapist.name}>
                  {therapist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Rating *</Label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() =>
                setNewReview((prev) => ({ ...prev, rating: star }))
              }
              className="p-1"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= newReview.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="title">Review Title *</Label>
        <Input
          id="title"
          value={newReview.title}
          onChange={(e) =>
            setNewReview((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Summarize your experience"
        />
      </div>

      <div>
        <Label htmlFor="review">Your Review *</Label>
        <Textarea
          id="review"
          value={newReview.review}
          onChange={(e) =>
            setNewReview((prev) => ({ ...prev, review: e.target.value }))
          }
          placeholder="Share your detailed experience with the treatment..."
          rows={4}
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Patient Testimonials</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real experiences from our patients who have transformed their health
          through Ayurvedic treatments.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {reviewStats.totalReviews}
            </div>
            <div className="text-sm text-muted-foreground">Total Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
              {reviewStats.averageRating}
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {reviewStats.verifiedReviews}
            </div>
            <div className="text-sm text-muted-foreground">
              Verified Reviews
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="recent">Recent Reviews</SelectItem>
              <SelectItem value="high-rated">High Rated (4-5 stars)</SelectItem>
              <SelectItem value="service-s1">Abhyanga Reviews</SelectItem>
              <SelectItem value="service-s2">Shirodhara Reviews</SelectItem>
              <SelectItem value="service-s3">Panchakarma Reviews</SelectItem>
              <SelectItem value="therapist-t1">Dr. Meera Sharma</SelectItem>
              <SelectItem value="therapist-t2">Dr. Rajesh Kumar</SelectItem>
              <SelectItem value="therapist-t3">Dr. Anita Reddy</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
              <DialogDescription>
                Help others by sharing your experience with our Ayurvedic
                treatments.
              </DialogDescription>
            </DialogHeader>
            <AddReviewForm />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddReview(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReview}>Submit Review</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewStats.ratingDistribution[rating];
              const percentage =
                reviewStats.totalReviews > 0
                  ? (count / reviewStats.totalReviews) * 100
                  : 0;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      {/* No results */}
      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            No reviews found matching your criteria.
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setFilter("all");
              setSortBy("recent");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Ready to Start Your Healing Journey?
          </h3>
          <p className="text-muted-foreground mb-4">
            Join thousands of satisfied patients who have experienced the
            transformative power of Ayurveda.
          </p>
          <Button size="lg">Book Your Consultation</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialsSection;
