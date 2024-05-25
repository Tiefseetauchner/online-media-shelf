#!/bin/bash

# Publish the project
dotnet publish ./OnlineMediaShelf.Web -c Release -o ./publish

# Create a tar.gz package
tar -czvf online-media-shelf.tar.gz -C ./publish .

# Remove publish Directory
rm -r ./publish
