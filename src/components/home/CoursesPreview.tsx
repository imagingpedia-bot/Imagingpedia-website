import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Users, Star, ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

interface Course {
  id: number;
  course_name: string;
  course_description: string;
  course_image: string;
  video_count?: number;
  created_at: string;
}

export const CoursesPreview = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (response.ok) {
          const data = await response.json();
          // Show only first 3 courses on home page
          setCourses(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Courses
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Start Your Learning{" "}
              <span className="text-gradient">Journey</span>
            </h2>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/courses" className="flex items-center gap-2">
              View All Courses
              <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card overflow-hidden card-hover group h-full"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.course_image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop"}
                      alt={course.course_name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    {index === 0 && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        Featured
                      </span>
                    )}
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
                        <Video size={14} />
                        {course.video_count || 0} videos
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="text-sm font-medium text-primary">
                        View Course
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link to="/courses" className="flex items-center gap-2">
              View All Courses
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
