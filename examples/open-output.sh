#!/bin/bash

# Open all PDFs in the output folder
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open examples/output/*.pdf
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open examples/output/*.pdf
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    start examples/output/*.pdf
fi
