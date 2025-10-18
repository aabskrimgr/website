# EmailJS Setup for Netlify

## Environment Variables Configuration

After deploying to Netlify, you need to add the following environment variables in your Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

```
VITE_EMAILJS_SERVICE_ID=service_3ep2eok
VITE_EMAILJS_TEMPLATE_ID=template_fi7xnhz
VITE_EMAILJS_PUBLIC_KEY=GU_8vzd9Tnbbrvz1r
```

4. Click **Save**
5. Trigger a new deployment for the changes to take effect

## Testing Locally

The contact form should now work locally. Test it by:
1. Starting the dev server: `npm run dev`
2. Navigate to the Contact section
3. Fill out and submit the form
4. Check your email for the message

## EmailJS Template Setup

Make sure your EmailJS template (template_fi7xnhz) includes these variables:
- `{{user_name}}` - Sender's name
- `{{user_email}}` - Sender's email
- `{{message}}` - Message content
