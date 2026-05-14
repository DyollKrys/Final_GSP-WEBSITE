import { useState, useEffect } from "react";
import PublicLayout from "../layouts/PublicLayout";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const announcements = [
  { id: 1, title: "Leadership Summit 2025", date: "March 15", description: "Join us for our annual leadership summit" },
  { id: 2, title: "Community Service Day", date: "March 22", description: "Help us make a difference in our community" },
  { id: 3, title: "Troop Meeting", date: "March 29", description: "Weekly gathering for all scouts" },
  { id: 4, title: "Camping Adventure", date: "April 5", description: "Outdoor camping experience for juniors" },
];

const programs = [
  { id: 1, name: "Brownie Girl Scouts", ageGroup: "4-6 years", image: "/programs/4-6yrs.avif" },
  { id: 2, name: "Junior Girl Scouts", ageGroup: "6-7 years", image: "/programs/6-7yrs.avif" },
  { id: 3, name: "Cadette Girl Scouts", ageGroup: "7-9 years", image: "/programs/7-9 yrs.avif" },
  { id: 4, name: "Senior Girl Scouts", ageGroup: "9-12 years", image: "/programs/9-12yrs.avif" },
  { id: 5, name: "Young Adults", ageGroup: "15-21 years", image: "/programs/15-21.avif" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

  const slides = [
    { id: 1, image: "/carousel/1.jpg" },
    { id: 2, image: "/carousel/2.jpg" },
    { id: 3, image: "/carousel/3.jpg" },
    { id: 4, image: "/carousel/4.jpg" },
    { id: 5, image: "/carousel/5.avif" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <PublicLayout>
      {/* CAROUSEL HERO */}
      <section className="relative h-96 md:h-screen overflow-hidden bg-black">
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute w-full h-full transition-opacity duration-1000 ${
                idx === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full z-10 transition"
        >
          <ChevronLeft className="w-6 h-6 text-green-900" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full z-10 transition"
        >
          <ChevronRight className="w-6 h-6 text-green-900" />
        </button>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-5 py-20">
        <h2 className="text-5xl italic font-bold text-green-900 mb-12 text-center">
          Announcements
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {announcements.slice(0, 4).map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <div className="bg-green-900 text-white p-6 text-center">
                <h3 className="text-2xl font-bold">{announcement.date.split(" ")[0]}</h3>
                <p className="text-sm">{announcement.date.split(" ")[1]}</p>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-800 mb-2">{announcement.title}</h4>
                <p className="text-gray-600 text-sm">{announcement.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAllAnnouncements(true)}
            className="bg-green-900 hover:bg-green-800 text-white px-12 py-3 rounded-full text-lg font-semibold transition"
          >
            View All
          </button>
        </div>
      </section>

      {/* VIEW ALL ANNOUNCEMENTS MODAL */}
      {showAllAnnouncements && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto relative">
            <button
              onClick={() => setShowAllAnnouncements(false)}
              className="absolute top-6 right-6 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-10">
              <h2 className="text-4xl font-bold text-green-900 mb-8">All Announcements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex gap-4">
                      <div className="bg-green-900 text-white rounded-lg p-4 text-center min-w-fit">
                        <p className="text-2xl font-bold">{announcement.date.split(" ")[0]}</p>
                        <p className="text-xs">{announcement.date.split(" ")[1]}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">{announcement.title}</h4>
                        <p className="text-gray-600">{announcement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY SECTION */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="mb-12">
            <h3 className="text-4xl font-bold text-green-900 mb-6">History</h3>
            <p className="text-lg text-gray-700 leading-8">
              The <strong>Girl Scouts of the Philippines (GSP)</strong> was founded on May 26, 1940, through a law signed by President Manuel L. Quezon. It was inspired by the global Girl Scout movement started by <strong>Juliette Gordon Low</strong>.
              <br /><br />
              One of its key founders was <strong>Josefa Llanes Escoda</strong>, who is known as the <em>"Mother of Girl Scouting in the Philippines."</em> She played an important role in organizing and promoting Girl Scouting in the country.
              <br /><br />
              The organization was created to help Filipino girls develop leadership, good character, and a sense of service. Despite interruptions during World War II, it grew nationwide and in 1948 became part of the World Association of Girl Guides and Girl Scouts. Today, it continues to guide young girls in leadership, teamwork, and community involvement.
            </p>
          </div>

          {/* FOUNDER SECTION */}
          <div className="bg-white rounded-3xl p-10 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <img
                src="/josefa-llanes-escoda.jpg"
                alt="Josefa Llanes Escoda"
                className="w-128 h-128 rounded-2xl object-cover shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-900 mb-4">Josefa Llanes Escoda</h3>
              <p className="text-gray-700 leading-8">
                She was born on <strong>September 20, 1898, in Dingras, Ilocos Norte</strong>. She studied both in the Philippines and in the United States, where she learned about Girl Scouting. When she returned home, she worked to organize and promote scouting for Filipino girls, helping establish the Girl Scouts of the Philippines in 1940.
                <br /><br />
                During World War II, she bravely supported Filipino resistance by helping prisoners and secretly aiding guerrilla forces. She was later arrested by Japanese forces and died in 1945.
                <br /><br />
                Today, she is remembered as a heroine who dedicated her life to service, leadership, and empowering Filipino women and youth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section className="max-w-7xl mx-auto px-5 py-20">
        <h3 className="text-4xl font-bold text-green-900 mb-12 text-center">Our Programs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              <div className="bg-green-900 h-40 flex items-center justify-center overflow-hidden">
                <img
                  src={program.image}
                  alt={program.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="font-bold text-gray-800 mb-2">{program.name}</h4>
                <p className="text-green-900 text-sm font-semibold">{program.ageGroup}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}