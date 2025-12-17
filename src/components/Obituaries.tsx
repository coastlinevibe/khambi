import React, { useState, useEffect } from "react";
import { TestimonialsColumn } from "./ui/testimonials-columns-1";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { X, MessageSquare, Upload, Loader2 } from "lucide-react";
import { obituariesApi, Obituary } from "../lib/api/obituaries";
import { toast } from "react-hot-toast";
import { DatePicker } from "./ui/DatePicker";

interface ObituariesProps {
  isSidebarCollapsed: boolean;
}

interface ObituaryDisplay {
  text: string;
  image: string;
  name: string;
  role: string;
}

const Obituaries: React.FC<ObituariesProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    image: null as File | null,
    dateFrom: "",
    dateUntil: "",
    biography: "",
    deceasedName: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch obituaries from database
  useEffect(() => {
    loadObituaries();
  }, []);

  const loadObituaries = async () => {
    try {
      setLoading(true);
      const data = await obituariesApi.getAll();
      setObituaries(data);
    } catch (error) {
      console.error('Error loading obituaries:', error);
      toast.error('Failed to load obituaries');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (formData.image) {
        try {
          imageUrl = await obituariesApi.uploadImage(formData.image);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Continue without image if upload fails
          toast.error('Image upload failed, but obituary will be submitted without photo.');
        }
      }

      // Create obituary
      await obituariesApi.create({
        name: formData.deceasedName,
        birth_date: formData.dateFrom,
        death_date: formData.dateUntil,
        biography: formData.biography || formData.message,
        image_url: imageUrl,
      });

      toast.success('Obituary submitted successfully! It will be reviewed by our team.');
      setShowMessageForm(false);
      setFormData({ 
        name: "", 
        email: "", 
        message: "", 
        image: null, 
        dateFrom: "", 
        dateUntil: "",
        biography: "",
        deceasedName: "",
      });
      setImagePreview(null);
      
      // Reload obituaries
      loadObituaries();
    } catch (error) {
      console.error('Error submitting obituary:', error);
      toast.error('Failed to submit obituary. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Convert database obituaries to display format
  const displayObituaries: ObituaryDisplay[] = obituaries.map(obit => ({
    text: obit.biography || `In loving memory of ${obit.name}`,
    image: obit.image_url || 'https://via.placeholder.com/150',
    name: obit.name,
    role: `${new Date(obit.birth_date).getFullYear()} - ${new Date(obit.death_date).getFullYear()}`,
  }));

  const firstColumn = displayObituaries.slice(0, 3);
  const secondColumn = displayObituaries.slice(3, 6);
  const thirdColumn = displayObituaries.slice(6, 9);

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
            Submit an Obituary
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className={`w-12 h-12 animate-spin ${isDark ? 'text-khambi-accent' : 'text-khambi-primary'}`} />
          </div>
        ) : displayObituaries.length === 0 ? (
          <div className={`text-center py-20 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-lg">No obituaries available at this time.</p>
          </div>
        ) : (
          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        )}
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
                    Submit an Obituary
                  </h3>
                  <button
                    onClick={() => setShowMessageForm(false)}
                    disabled={submitting}
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
                    Deceased Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deceasedName}
                    onChange={(e) => setFormData({ ...formData, deceasedName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-khambi-accent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-khambi-accent'
                    } focus:outline-none focus:ring-2 focus:ring-khambi-accent/20`}
                    placeholder="Full name of the deceased"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Name *
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
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Email *
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
                    placeholder="Your email address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label="Birth Date"
                    value={formData.dateFrom}
                    onChange={(date) => setFormData({ ...formData, dateFrom: date })}
                    maxDate={new Date().toISOString().split('T')[0]}
                    required
                    isDark={isDark}
                  />

                  <DatePicker
                    label="Passing Date"
                    value={formData.dateUntil}
                    onChange={(date) => setFormData({ ...formData, dateUntil: date })}
                    maxDate={new Date().toISOString().split('T')[0]}
                    minDate={formData.dateFrom || undefined}
                    required
                    isDark={isDark}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Upload className="w-4 h-4 inline mr-1" />
                    Upload Image (Optional)
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                      isDark
                        ? 'border-gray-600 hover:border-khambi-accent'
                        : 'border-gray-300 hover:border-khambi-accent'
                    }`}>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Click to upload or drag and drop
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Biography / Tribute *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-khambi-accent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-khambi-accent'
                    } focus:outline-none focus:ring-2 focus:ring-khambi-accent/20`}
                    placeholder="Share memories, achievements, and what made them special..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    disabled={submitting}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isDark
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-khambi-accent hover:bg-khambi-gold text-black rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Obituary'
                    )}
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

