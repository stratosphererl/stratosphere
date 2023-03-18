import subprocess
import sys
import platform

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

if __name__ == "__main__":
    platform = platform.system()

    if platform == "Windows":
        install("whl/boxcars_py-0.1.15-cp310-none-win_amd64.whl")
    elif platform == "Linux":
        install("whl/boxcars_py-0.1.15-cp38-cp38-manylinux1_x86_64.whl")
    elif platform == "Darwin": # doesn't include non-Apple Silicon Macs, sorry :(
        install("whl/boxcars_py-0.1.15-cp38-cp38-macosx_11_0_arm64.whl")