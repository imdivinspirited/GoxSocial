#!/bin/bash

# Create target directory
mkdir -p ~/Downloads/gox-social-logos

# Copy SVG files
cp WebsiteFoundation/client/public/images/gox-logo.svg ~/Downloads/gox-social-logos/
cp WebsiteFoundation/client/public/images/gox-icon.svg ~/Downloads/gox-social-logos/

echo "Logos copied to ~/Downloads/gox-social-logos/"
echo "Files copied:"
ls -la ~/Downloads/gox-social-logos/ 