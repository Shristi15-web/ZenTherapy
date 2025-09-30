import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Search,
  Calendar,
  Clock,
  User,
  BookOpen,
  Star,
  ArrowRight,
  Filter,
  Heart,
  Lightbulb,
  TrendingUp,
  Leaf,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  blogArticles,
  blogCategories,
  wellnessTips,
  getFeaturedArticles,
  getArticlesByCategory,
  searchArticles,
} from "@/data/blog.js";
import { format } from "date-fns";

const BlogSection = () => {
  const [articles, setArticles] = useState(blogArticles);
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  // Filter articles based on category and search
  useEffect(() => {
    let filtered = blogArticles; // Use the original array instead of state

    if (selectedCategory !== "All Articles") {
      filtered = getArticlesByCategory(selectedCategory);
    }

    if (searchQuery) {
      filtered = searchArticles(searchQuery);
    }

    setArticles(filtered);
  }, [selectedCategory, searchQuery]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsArticleOpen(true);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const ArticleCard = ({ article, featured = false }) => (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
        featured
          ? "border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white"
          : ""
      }`}
      onClick={() => handleArticleClick(article)}
    >
      <div className="relative">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {featured && (
          <Badge className="absolute top-3 left-3 bg-blue-600">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-white/90"
        >
          {article.category}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <User className="w-4 h-4" />
          <span>{article.author}</span>
          <Separator orientation="vertical" className="h-4" />
          <Calendar className="w-4 h-4" />
          <span>{formatDate(article.publishedAt)}</span>
          <Separator orientation="vertical" className="h-4" />
          <Clock className="w-4 h-4" />
          <span>{article.readTime}</span>
        </div>

        <h3
          className={`font-semibold mb-3 line-clamp-2 ${
            featured ? "text-lg" : "text-base"
          }`}
        >
          {article.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Button
          variant="ghost"
          className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );

  const WellnessTipCard = ({ tip }) => (
    <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Lightbulb className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-green-800 mb-2">{tip.title}</h4>
            <p className="text-sm text-green-700 mb-3">{tip.content}</p>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="text-xs border-green-300 text-green-700"
              >
                {tip.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-green-300 text-green-700"
              >
                {tip.timeRequired}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ArticleReader = ({ article }) => (
    <Dialog open={isArticleOpen} onOpenChange={setIsArticleOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <Badge className="mb-3 bg-white/20 backdrop-blur-sm">
              {article.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>
          </div>
        </div>

        <ScrollArea className="p-6 max-h-[60vh]">
          <div className="prose prose-sm max-w-none">
            <div className="text-lg text-muted-foreground mb-6 font-medium">
              {article.excerpt}
            </div>

            <div className="whitespace-pre-line leading-relaxed">
              {article.content}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-muted rounded-full">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold">{article.author}</h4>
                  <p className="text-sm text-muted-foreground">
                    {article.authorRole}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  const featuredArticles = getFeaturedArticles();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Wellness Blog
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover ancient wisdom and modern insights for your wellness journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {blogCategories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Articles */}
      {selectedCategory === "All Articles" && !searchQuery && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* Daily Wellness Tips */}
      {selectedCategory === "All Articles" && !searchQuery && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-5 h-5 text-green-500" />
            <h2 className="text-2xl font-bold">Daily Wellness Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellnessTips.map((tip) => (
              <WellnessTipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-bold">
              {searchQuery ? "Search Results" : selectedCategory}
            </h2>
            <Badge variant="secondary">{articles.length} articles</Badge>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No articles match "${searchQuery}". Try a different search term.`
                : `No articles in "${selectedCategory}" category yet.`}
            </p>
            {(searchQuery || selectedCategory !== "All Articles") && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Articles");
                }}
              >
                View All Articles
              </Button>
            )}
          </Card>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 text-center">
        <Heart className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Stay Connected</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Get weekly wellness tips and the latest articles delivered to your
          inbox
        </p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <Input placeholder="Enter your email" className="flex-1" />
          <Button>Subscribe</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          No spam, unsubscribe anytime
        </p>
      </section>

      {/* Article Reader Dialog */}
      {selectedArticle && <ArticleReader article={selectedArticle} />}
    </div>
  );
};

export default BlogSection;
