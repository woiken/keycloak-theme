import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Trash2, Loader2, User } from "lucide-react";

interface AvatarUploadProps {
  /** The realm name for API calls */
  realm: string;
  /** User's first name for initials fallback */
  firstName?: string;
  /** User's last name for initials fallback */
  lastName?: string;
}

export function AvatarUpload({ realm, firstName, lastName }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAvatarApiUrl = useCallback(() => {
    return `/realms/${realm}/avatar`;
  }, [realm]);

  const getInitials = () => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "?";
  };

  // Load avatar on mount
  useEffect(() => {
    const loadAvatar = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(getAvatarApiUrl(), {
          credentials: "include",
        });

        if (response.ok) {
          const blob = await response.blob();
          setAvatarUrl(URL.createObjectURL(blob));
        } else {
          // No avatar exists, that's fine
          setAvatarUrl(null);
        }
      } catch (err) {
        console.error("Failed to load avatar:", err);
        setAvatarUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatar();
  }, [getAvatarApiUrl]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, GIF, or WebP image.");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Image is too large. Maximum size is 5MB.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      const response = await fetch(getAvatarApiUrl(), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (response.ok) {
        // Reload the avatar
        const avatarResponse = await fetch(getAvatarApiUrl(), {
          credentials: "include",
        });
        if (avatarResponse.ok) {
          const blob = await avatarResponse.blob();
          if (avatarUrl) {
            URL.revokeObjectURL(avatarUrl);
          }
          setAvatarUrl(URL.createObjectURL(blob));
        }
        setSuccess("Avatar uploaded successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to upload avatar. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your avatar?")) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      const response = await fetch(getAvatarApiUrl(), {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        if (avatarUrl) {
          URL.revokeObjectURL(avatarUrl);
        }
        setAvatarUrl(null);
        setSuccess("Avatar removed successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to remove avatar. Please try again.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to remove avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>

      <div className="flex items-center gap-6">
        {/* Avatar display */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-medium text-muted-foreground">
                {getInitials() || <User className="w-10 h-10" />}
              </span>
            )}
          </div>

          {/* Upload overlay */}
          {isUploading && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={isUploading || isLoading}
          >
            <Camera className="w-4 h-4 mr-2" />
            {avatarUrl ? "Change" : "Upload"}
          </Button>

          {avatarUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isUploading || isLoading}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-muted-foreground">
        Recommended: Square image, at least 200x200 pixels. Max 5MB.
      </p>
    </div>
  );
}
