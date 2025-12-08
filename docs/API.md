# API Documentation

## Base URL

```
http://localhost:5000
```

## Endpoints

### Health Check

```
GET /health
```

Returns the health status of the API.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### API Information

```
GET /
```

Returns basic API information.

**Response:**
```json
{
  "message": "Hidden Treasures Network API",
  "version": "1.0.0"
}
```

## Authentication

Authentication endpoints will be added here.

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
