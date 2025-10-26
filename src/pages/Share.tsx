import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";

const Share = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shareData, setShareData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShareData = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('shared_images')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching share data:', error);
        navigate('/');
        return;
      }

      setShareData(data);
      setLoading(false);
    };

    fetchShareData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-lab-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lab-primary"></div>
      </div>
    );
  }

  if (!shareData) {
    return null;
  }

  const shareUrl = window.location.href;
  const shareMessage = shareData.share_message || "Generated in the Bria GAIA Lab";
  
  return (
    <>
      <Helmet>
        <title>{shareMessage}</title>
        <meta name="description" content={shareMessage} />
        
        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content={shareMessage} />
        <meta property="og:description" content={shareMessage} />
        <meta property="og:image" content={shareData.image_url} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareMessage} />
        <meta name="twitter:description" content={shareMessage} />
        <meta name="twitter:image" content={shareData.image_url} />
        
        {/* LinkedIn specific */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>

      <div className="min-h-screen bg-lab-background flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-lab-surface rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-lab-text-primary mb-4">
            {shareMessage}
          </h1>
          <img 
            src={shareData.image_url} 
            alt="Shared image" 
            className="w-full rounded-lg"
          />
          <div className="mt-6 flex gap-4">
            <a
              href="/"
              className="px-6 py-2 bg-lab-primary text-white rounded-lg hover:bg-lab-primary-hover transition-colors"
            >
              Create Your Own
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Share;