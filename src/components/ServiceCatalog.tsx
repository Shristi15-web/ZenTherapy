import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Star, Search, Filter, DollarSign, Users } from "lucide-react";
import {
  therapyServices,
  serviceCategories,
  servicePackages,
  getServicesByCategory,
  searchServices,
} from "@/data/services.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const ServiceCatalog = ({ onBookService }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showPackages, setShowPackages] = useState(false);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let services =
      selectedCategory === "all"
        ? therapyServices
        : getServicesByCategory(selectedCategory);

    if (searchTerm) {
      services = searchServices(searchTerm);
    }

    // Sort services
    return services.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          return a.duration - b.duration;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchTerm, selectedCategory, sortBy]);

  const ServiceCard = ({ service }) => (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">
              {service.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {service.shortDescription}
            </CardDescription>
          </div>
          <img
            src={service.image}
            alt={service.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">{service.category}</Badge>
          {service.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {service.duration} min
            </div>
            <div className="flex items-center gap-1 font-semibold text-lg text-primary">
              <DollarSign className="w-4 h-4" />
              {service.price}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Key Benefits:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {service.benefits?.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              Learn More
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-start gap-3">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-xl">{service.name}</h2>
                  <p className="text-muted-foreground font-normal">
                    {service.shortDescription}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ${service.price}
                    </div>
                    <div className="text-sm text-muted-foreground">Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {service.duration}
                    </div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Benefits</h3>
                  <div className="grid grid-cols-1 gap-1">
                    {service.benefits?.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge>{service.category}</Badge>
                  {service.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                onClick={() => onBookService?.(service)}
              >
                Book This Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button className="flex-1" onClick={() => onBookService?.(service)}>
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );

  const PackageCard = ({ package: pkg }) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {pkg.name}
          <Badge variant="destructive">Save ${pkg.savings}</Badge>
        </CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Package Price:
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                ${pkg.packagePrice}
              </div>
              <div className="text-sm text-muted-foreground line-through">
                ${pkg.originalPrice}
              </div>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span>{pkg.duration} minutes total</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sessions:</span>
            <span>{pkg.sessions} sessions</span>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Included Services:</h4>
            <div className="space-y-1">
              {pkg.services.map((serviceId) => {
                const service = therapyServices.find((s) => s.id === serviceId);
                return service ? (
                  <div key={serviceId} className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="text-muted-foreground">
                      ${service.price}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onBookService?.(pkg)}>
          Book Package
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Our Ayurveda Services</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our comprehensive range of traditional Ayurvedic treatments
          designed to restore balance and promote natural healing.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name} ({category.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggle between Services and Packages */}
      <div className="flex gap-2">
        <Button
          variant={!showPackages ? "default" : "outline"}
          onClick={() => setShowPackages(false)}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Individual Services ({filteredServices.length})
        </Button>
        <Button
          variant={showPackages ? "default" : "outline"}
          onClick={() => setShowPackages(true)}
          className="flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          Service Packages ({servicePackages.length})
        </Button>
      </div>

      {/* Services/Packages Grid */}
      {!showPackages ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicePackages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      )}

      {/* No results */}
      {!showPackages && filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No services found matching your criteria.
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceCatalog;
