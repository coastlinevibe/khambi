import React, { useState } from "react";
import { TestimonialsColumn } from "./ui/testimonials-columns-1";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { X, MessageSquare, Upload, Calendar } from "lucide-react";

interface ObituariesProps {
  isSidebarCollapsed: boolean;
}

const obituaries = [
  {
    text: "In loving memory of a devoted mother and grandmother. Her kindness, wisdom, and warm smile will forever remain in our hearts.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Margaret Thompson",
    role: "1945 - 2024",
  },
  {
    text: "A beloved father, husband, and friend. His dedication to family and community inspired all who knew him. Rest in peace.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "James Mitchell",
    role: "1952 - 2024",
  },
  {
    text: "Cherished grandmother who touched countless lives with her generosity and love. Her legacy of compassion lives on through us.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Elizabeth Johnson",
    role: "1938 - 2024",
  },
  {
    text: "A loving husband and devoted father. His strength, humor, and unwavering support will be deeply missed by all who knew him.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    name: "Robert Williams",
    role: "1960 - 2024",
  },
  {
    text: "In memory of a beautiful soul who brought joy to everyone she met. Her laughter and kindness will echo in our hearts forever.",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    name: "Sarah Davis",
    role: "1975 - 2024",
  },
  {
    text: "A dedicated teacher and mentor who shaped countless young minds. His passion for education and life will never be forgotten.",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "Michael Brown",
    role: "1948 - 2024",
  },
  {
    text: "Beloved wife and mother whose grace and strength inspired all. Her memory will be a blessing to those who loved her.",
    image: "https://randomuser.me/api/portraits/women/36.jpg",
    name: "Patricia Anderson",
    role: "1955 - 2024",
  },
  {
    text: "A cherished friend and community leader. His commitment to helping others and making a difference will always be remembered.",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    name: "David Martinez",
    role: "1942 - 2024",
  },
  {
    text: "In loving memory of a devoted sister and aunt. Her warmth, creativity, and loving spirit touched everyone she encountered.",
    image: "https://randomuser.me/api/portraits/women/52.jpg",
    name: "Linda Garcia",
    role: "1968 - 2024",
  },
];

const firstColumn = obituaries.slice(0, 3);
const secondColumn = obituaries.slice(3, 6);
const thirdColumn = obituaries.slice(6, 9);

const Obituaries: React.FC<ObituariesProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    image: null as File | null,
    dateFrom: "",
    dateUntil: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Message submitted:", formData);
    setShowMessageForm(false);
    setFormData({ name: "", email: "", message: "", image: null, dateFrom: "", dateUntil: "" });
  };

  return (
    <section
      id="obituaries"
      className={`relative py-20 transition-all duration-700 ease-in-out ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className={`px-6 py-3 rounded-xl ${
              isDark 
                ? 'bg-khambi-accent/20' 
                : 'bg-khambi-accent/10'
            }`} style={{ borderColor: '#B8935E', borderWidth: '1px' }}>
              <span className={`text-2xl font-bold ${
                isDark 
                  ? 'text-khambi-accent' 
                  : 'text-khambi-primary'
              }`}>
                Obituaries
              </span>
            </div>
          </div>

          <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            In Loving Memory
          </h2>
          <p className={`text-center mt-5 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Honoring the lives and legacies of those we've helped celebrate.
          </p>

          <button
            onClick={() => setShowMessageForm(true)}
            className="mt-6 flex items-center justify-center gap-2 px-8 py-4 bg-khambi-primary text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-khambi-darkgray hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-khambi-accent"
          >
            <MessageSquare className="w-6 h-6 text-khambi-accent" />
            Add a Message
          </button>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>

      {/* Message Form Modal */}
      <AnimatePresence>
        {showMessageForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-2xl shadow-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Share Your Memory
                  </h3>
                  <button
                    onClick={() => setShowMessageForm(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-khambi-accent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-khambi-accent'
                    } focus:outline-none focus:ring-2 focus:ring-khambi-accent/20`}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-khambi-accent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-khambi-accent'
                    } focus:outline-none focus:ring-2 focus:ring-khambi-accent/20`}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Calendar className="w-4 h-4 inline mr-1" />
                      From Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateFrom}
                      onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-khambi-accent'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-khambi-accent'
                      } focus:outline-none focus:ring-2 focus:ring-khambi-accent/20`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Until Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateUntil}
                      onChange={(e) => setFormData({ ...formData, dateUntil: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-khambi-accent'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-khambi-accent'
                      } focus:outline-none focus:ring-2 focus:ring-khambi-accent/20`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Upload className="w-4 h-4 inline mr-1" />
                    Upload Image
                  </label>
                  <div className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isDark
                      ? 'border-gray-600 hover:border-khambi-accent'
                      : 'border-gray-300 hover:border-khambi-accent'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formData.image ? formData.image.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-khambi-accent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-khambi-accent'
                    } focus:outline-none focus:ring-2 focus:ring-khambi-accent/20`}
                    placeholder="Share your condolences and memories..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isDark
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-khambi-accent hover:bg-khambi-gold text-black rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Obituaries;

