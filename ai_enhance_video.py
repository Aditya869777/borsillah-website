import os
import subprocess

print("WARNING: Running AI upscaling and background removal locally on 1200 frames will take several hours/days depending on your GPU!")

def extract_frames():
    os.makedirs("raw_frames", exist_ok=True)
    subprocess.run(["ffmpeg", "-i", "public/older-video.mp4", "-vf", "fps=60", "raw_frames/frame_%04d.png"])
    print("Frames extracted!")

def remove_backgrounds():
    os.makedirs("clean_frames", exist_ok=True)
    # Using rembg (Background Removal AI)
    # This requires: pip install rembg[gpu]
    print("Starting background removal on all frames... This will take a long time.")
    subprocess.run(["rembg", "p", "raw_frames", "clean_frames"])
    print("Backgrounds removed!")

def run_realesrgan():
    os.makedirs("upscaled_frames", exist_ok=True)
    # Requires Real-ESRGAN installed locally via python
    # This requires: pip install realesrgan
    print("Starting Real-ESRGAN 4x Upscaling... Please be patient.")
    subprocess.run(["python", "-m", "realesrgan.inference_realesrgan", "-n", "RealESRGAN_x4plus", "-i", "clean_frames", "-o", "upscaled_frames"])
    print("Frames upscaled!")

def reassemble_video():
    print("Stitching frames back into a 60FPS transparent WebM video...")
    subprocess.run(["ffmpeg", "-framerate", "60", "-i", "upscaled_frames/frame_%04d.png", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "public/final_super_video.webm"])
    print("Done! Check public/final_super_video.webm")

if __name__ == "__main__":
    print("Make sure you have run: pip install rembg[gpu] realesrgan")
    extract_frames()
    # remove_backgrounds()
    # run_realesrgan()
    # reassemble_video()
