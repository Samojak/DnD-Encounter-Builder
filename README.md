# Encounter Builder (D&D 5e)

A full-stack web application for building and balancing Dungeons & Dragons 5e encounters using official XP and difficulty rules.

![Encounter Builder Screenshot](/Pics/ScreenShot.png)

## Overview

Encounter Builder helps Dungeon Masters quickly create encounters by selecting monsters and defining a party. The app calculates encounter difficulty based on party composition and monster XP multipliers according to D&D 5e guidelines.

This project was built as a portfolio project to demonstrate full-stack development with .NET, API integration, and solving a real use case for D&D.

## Features

* Import monsters from external D&D 5e API
* Store and query monsters locally using a database
* Search, filter, and sort monsters
* Add/remove monsters to an encounter with quantity control
* Define party size and level
* Calculate encounter difficulty (Easy, Medium, Hard, Deadly)
* Real-time UI updates using Blazor

## Tech Stack

### Backend

* ASP.NET Core Web API (.NET 10)
* Entity Framework Core
* SQLite database
* REST API architecture

### Frontend

* Blazor Web App (Interactive Server)
* Component-based UI
* Scoped CSS styling

### External API

* https://www.dnd5eapi.co/

## Architecture

The project is structured into multiple layers:

* **API**: Handles business logic, database, and external API integration
* **Shared**: DTOs and shared models between frontend and backend
* **Web**: Blazor frontend UI

Data flow:

1. Monsters are fetched from external API  
2. Stored locally in database  
3. Served via API endpoints  
4. Displayed and manipulated in UI  
5. Encounter calculation performed on backend  

## Encounter Calculation

The application follows official D&D 5e rules:

* XP thresholds per player level (Easy, Medium, Hard, Deadly)
* Total party threshold = sum of individual thresholds
* Monster XP is adjusted using multipliers based on number of monsters
* Party size affects multiplier scaling

Example output includes:

* Raw XP  
* Adjusted XP  
* Monster count  
* Difficulty rating  

## Getting Started

### Prerequisites

* .NET 10 SDK
* Rider / Visual Studio / VS Code
* Internet connection (for initial monster import)

### Run the application

1. Run the API project  
2. Run the Web project  
3. Open the browser at the Web app URL  

### Import monsters

Call the import endpoint once:

POST `/api/dev/import-monsters`

This will fetch and store all monsters locally.

## Project Structure


/API
Controllers
Services
Data
Clients
Mappers

/Shared
DTOs
Enums

/Web
Pages
Services
Components


## Future Improvements

* Mixed-level party support  
* Encounter saving and loading  
* Advanced filtering (type, environment, size)  
* Pagination or virtualization for large lists  
* UI improvements and theming  
* Deployment to cloud  

## Motivation

As a Dungeon Master, preparing balanced encounters can take time and break the flow of session prep. This tool speeds that up and gives immediate feedback, so you can focus more on storytelling and less on calculations.

## Author

Samuel Jakabovic

---

Feel free to fork, improve, and use for your own campaigns.
