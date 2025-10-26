import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ShareData {
  id: string;
  image_url: string;
  share_message: string | null;
}

const Share = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShareData = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('shared_images')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching share data:', error);
        setLoading(false);
        return;
      }

      setShareData(data);
      setLoading(false);
    };

    fetchShareData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-lab-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lab-primary mx-auto mb-4"></div>
          <p className="text-lab-text-secondary">Loading shared image...</p>
        </div>
      </div>
    );
  }

  if (!shareData) {
    return (
      <div className="min-h-screen bg-lab-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-lab-text-primary mb-4">Share not found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lab
          </Button>
        </div>
      </div>
    );
  }

  const defaultMessage = "Generated in the Bria GAIA Lab #BRIAAI #GAIA #BRIAGAIA";
  const shareMessage = shareData.share_message || defaultMessage;
  const currentUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Bria GAIA Lab - Shared Image</title>
        <meta name="description" content={shareMessage} />
        
        {/* Open Graph tags for social media */}
        <meta property="og:title" content="Bria GAIA Lab - Generated Image" />
        <meta property="og:description" content={shareMessage} />
        <meta property="og:image" content={shareData.image_url} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bria GAIA Lab - Generated Image" />
        <meta name="twitter:description" content={shareMessage} />
        <meta name="twitter:image" content={shareData.image_url} />
      </Helmet>

      <div className="min-h-screen bg-lab-surface">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate('/')} 
            className="mb-6"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lab
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="bg-lab-interactive-hover rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-lab-text-primary mb-2">
                Generated in Bria GAIA Lab
              </h1>
              <p className="text-lab-text-secondary">{shareMessage}</p>
            </div>

            <div className="bg-lab-surface border border-lab-border rounded-lg overflow-hidden">
              <img 
                src={shareData.image_url} 
                alt="Shared generated image"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Share;