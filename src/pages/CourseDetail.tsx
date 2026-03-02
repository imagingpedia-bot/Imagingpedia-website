import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  BookOpen, Play, 
  ArrowLeft
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_BASE_URL } from "@/lib/config";


interface CourseVideo {
  id: number;
  video_title: string;
  video_url: string;
  video_order?: number;
}

interface CourseDetailData {
  id: number;
  course_name: string;
  course_description: string;
  course_image: string;
  created_at: string;
  videos?: CourseVideo[];
}


const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/courses/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
      } else {
        setError("Course not found");
      }
    } catch (err) {
      console.error("Error fetching course:", err);
      setError("Error loading course details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center pt-24">
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24">
          <p className="text-red-500 mb-4">{error || "Course not found"}</p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const sortedVideos = (course.videos || []).sort((a, b) => (a.video_order || 0) - (b.video_order || 0));

  return (
    <>
      <Helmet>
        <title>{course.course_name} - Imagingpedia</title>
        <meta name="description" content={course.course_description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="relative py-16 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src={course.course_image}
                alt={course.course_name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={18} />
                Back to Courses
              </Link>

              {/* Course Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
              >
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {course.course_name}
                </h1>

                <p className="text-muted-foreground text-lg mb-8">
                  {course.course_description}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen size={18} />
                    <span>{sortedVideos.length} videos</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Course Videos */}
          <section className="py-16 bg-card/30">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                Course Videos
              </h2>

              {sortedVideos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No videos available for this course yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-w-4xl">
                  {sortedVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="w-full p-4 glass-card flex items-center gap-4 hover:bg-accent/50 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {video.video_title}
                          </h4>
                        </div>
                        <Play size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-xl font-semibold">{selectedVideo?.video_title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                src={selectedVideo.video_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.video_title}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseDetail;
