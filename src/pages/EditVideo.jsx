import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Loader from "../components/UI/Loader";
import { useToast } from "../components/UI/ToastContainer";
import { getVideoById, updateVideo } from "../api/video";
import { getErrorMessage } from "../utils/helpers";

const EditVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await getVideoById(videoId);
        const video = res.data.data;
        setFormData({
          title: video.title || "",
          description: video.description || "",
        });
      } catch (error) {
        addToast(getErrorMessage(error), "error");
        navigate("/my-videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast("Title is required", "warning");
      return;
    }

    setSaving(true);
    try {
      await updateVideo(videoId, formData);
      addToast("Video updated successfully!", "success");
      navigate(`/video/${videoId}`);
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader text="Loading video details..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="clay-card-no-hover p-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Edit Video
          </h1>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Update your video details
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="clay-input"
                placeholder="Video title"
                maxLength={100}
              />
              <p
                className="text-xs mt-1 text-right"
                style={{ color: "var(--text-muted)" }}
              >
                {formData.title.length}/100
              </p>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="clay-textarea"
                rows={8}
                placeholder="Video description"
                maxLength={5000}
              />
              <p
                className="text-xs mt-1 text-right"
                style={{ color: "var(--text-muted)" }}
              >
                {formData.description.length}/5000
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="clay-button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="clay-button flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div
                      className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                      style={{
                        borderColor: "white",
                        borderTopColor: "transparent",
                      }}
                    ></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditVideo;