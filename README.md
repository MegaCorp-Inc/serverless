# Assignment 7: Cloud Function for Email Verification with Pub/Sub Trigger

## Overview

This assignment involves the development of a cloud function tasked with sending verification emails to newly created users. The function is designed to be triggered by messages received from a Pub/Sub topic.

The serverless creates an entry in the userverifications table and sends the newly created token to bes used to verify the users

By leveraging the Mailgun API, our cloud function seamlessly integrates with email services, ensuring efficient delivery of verification emails to users.

This solution enhances the user onboarding process by automating the email verification step, thereby improving user experience and system reliability.
