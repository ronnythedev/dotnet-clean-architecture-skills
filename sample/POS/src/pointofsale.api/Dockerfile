# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files
COPY PointOfSale.sln ./
COPY src/pointofsale.domain/pointofsale.domain.csproj src/pointofsale.domain/
COPY src/pointofsale.application/pointofsale.application.csproj src/pointofsale.application/
COPY src/pointofsale.infrastructure/pointofsale.infrastructure.csproj src/pointofsale.infrastructure/
COPY src/pointofsale.api/pointofsale.api.csproj src/pointofsale.api/

# Restore dependencies
RUN dotnet restore

# Copy source code
COPY src/ src/

# Build and publish
WORKDIR /src/src/pointofsale.api
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "pointofsale.api.dll"]
