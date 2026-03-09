import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiFilm, HiPhotograph, HiUpload } from "react-icons/hi";
import MainLayout from "../components/Layout/MainLayout";
import { useToast } from "../components/UI/ToastContainer";
import { publishVideo } from "../api/video";
import { getErrorMessage } from "../utils/helpers";

const Upload = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        addToast("Video file too large. Max 100MB", "warning");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !videoFile) {
      addToast("Title and video are required", "warning");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("video", videoFile);
      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      // Simulate progress (real progress requires onUploadProgress in axios config)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const res = await publishVideo(data);
      clearInterval(progressInterval);
      setUploadProgress(100);

      addToast("Video uploaded successfully!", "success");
      setTimeout(() => {
        navigate(`/video/${res.data.data._id}`);
      }, 1000);
    } catch (error) {
      addToast(getErrorMessage(error), "error");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="clay-card-no-hover p-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Upload Video
          </h1>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Share your content with the world
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Video File *
              </label>
              <label className="cursor-pointer block">
                <div
                  className="clay-input !p-0 h-64 flex flex-col items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  {videoPreview ? (
                    <>
                      <video
                        src={videoPreview}
                        className="w-full h-full object-contain"
                        controls
                      />
                      <div
                        className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <HiUpload className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <HiFilm
                        className="w-16 h-16 mx-auto mb-4"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                        Click to upload video
                      </p>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        MP4, WebM, or OGG (Max 100MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {videoFile && (
                <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                  {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Thumbnail Upload (Optional) */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Custom Thumbnail (Optional)
              </label>
              <label className="cursor-pointer block">
                <div
                  className="clay-input !p-0 h-40 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  {thumbnailPreview ? (
                    <>
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <HiUpload className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                      <HiPhotograph className="w-5 h-5" />
                      <span className="text-sm">Upload custom thumbnail</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                Auto-generated if not provided
              </p>
            </div>

            <hr className="clay-divider" />

            {/* Title */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter video title"
                value={formData.title}
                onChange={handleChange}
                className="clay-input"
                disabled={uploading}
                maxLength={100}
              />
              <p className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>
                {formData.title.length}/100
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Description
              </label>
              <textarea
                name="description"
                placeholder="Tell viewers about your video"
                value={formData.description}
                onChange={handleChange}
                className="clay-textarea"
                rows={6}
                disabled={uploading}
                maxLength={5000}
              />
              <p className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>
                {formData.description.length}/5000
              </p>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Uploading...
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div className="clay-progress-bar">
                  <div
                    className="clay-progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="clay-button-secondary"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="clay-button flex items-center gap-2"
                disabled={uploading || !videoFile || !formData.title}
              >
                {uploading ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: "white", borderTopColor: "transparent" }}
                    ></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <HiUpload className="w-5 h-5" />
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;