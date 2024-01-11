# SMS Verification Express API: 

How to use: 
1) You need to get your Gmail accessToken and refreshToken 
2) Use `cp .env.example .env` then fill out the `.env` file
------

## Route: `/verify`

Body: 
```json
    {
        "phone": "1234560",
        "codeLength": 20, // Optional code length to send to the phone number above. (leave blank to use the default limit.)
    }
```

### Returns: 

#### Success: 
```json
    {
        "status": true,
        "code": "verification_code_sent"
    }
```
#### Fail: 
```json
    {
        "status": false,
        "message": "fail_message_here"
    }
```