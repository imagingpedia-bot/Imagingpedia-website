import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";


interface Course {
  id: number;
  course_name: string;
  course_description: string;
  course_image: string;
  video_count?: number;
  created_at?: string;
}

const defaultCategories = ["All"];
const defaultLevels = ["All Levels"];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        setError("Failed to load courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error loading courses");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.course_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Courses - Imagingpedia</title>
        <meta name="description" content="Explore comprehensive medical imaging courses in radiology, anatomy, and diagnostic sciences." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24">
          {/* Header */}
          <section className="py-16 section-gradient">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Explore Our <span className="text-gradient">Courses</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Comprehensive medical education designed for healthcare professionals at every stage.
                </p>
              </motion.div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Courses Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {isLoading && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Loading courses...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-16">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={fetchCourses}>Retry</Button>
                </div>
              )}

              {!isLoading && !error && (
                <>
                  <p className="text-muted-foreground mb-8">
                    Showing {filteredCourses.length} of {courses.length} courses
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Link to={`/courses/${course.id}`} className="block">
                          <div className="glass-card overflow-hidden card-hover group h-full">
                            <div className="relative overflow-hidden">
                              <img
                                src={course.course_image || "https://via.placeholder.com/400x300?text=No+Image"}
                                alt={course.course_name}
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                            </div>

                            <div className="p-6">
                              <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {course.course_name}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                {course.course_description}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                <span className="flex items-center gap-1">
                                  <BookOpen size={14} />
                                  {course.video_count || 0} videos
                                </span>
                              </div>

                              <div className="pt-4 border-t border-border/50">
                                <Button className="w-full">View Course</Button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {filteredCourses.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground text-lg">No courses found matching your search.</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Courses;
