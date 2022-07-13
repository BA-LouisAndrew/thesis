#!/bin/sh

pdflatex --shell-escape template 
bibtex template
pdflatex --shell-escape template
pdflatex --shell-escape template 