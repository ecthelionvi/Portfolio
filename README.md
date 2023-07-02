# Hosting a Static Website on AWS with a Custom Domain from Namecheap

## Requirements:

- A domain name: You need a domain name purchased from Namecheap or another domain registrar.
- A static website: This should be a collection of files like HTML, CSS, JavaScript, images, etc.
- An AWS account: You need an account on Amazon Web Services as you'll be using their S3, CloudFront, Route 53, and AWS Certificate Manager services.
- Basic understanding of DNS and web hosting concepts: This guide assumes familiarity with DNS records, hosting, SSL/TLS certificates, etc.

## Steps:

### 1. Create an AWS account:

- [Visit the AWS homepage](https://aws.amazon.com/)
- Click on the "Create an AWS Account" button.
- Enter your email address, password, and AWS account name.
- Provide the necessary contact information in the next section.
- In the payment information section, you'll need to provide valid credit or debit card details. While creating the account is free, AWS requires this information to verify your identity and for any potential future billing.
- Complete the identity verification process where you'll need to enter a phone number, and AWS will call or text to verify your identity.
- Choose a plan. If you're just getting started, the AWS Free Tier might be right for you.
- Read and agree to the terms and conditions, and then click "Create Account and Continue".
- After successfully creating your account, you'll be able to log into the AWS Management Console with the email address and password you provided.

### 2. Create an S3 bucket:

- [AWS Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
- Log into the AWS Management Console, go to the S3 service, and create a new bucket with a name of your choice.
- Make sure the bucket is in the same region as your CloudFront distribution will be.

#### 1. Install Node.js and npm

If you haven't installed Node.js or npm, you'll need to do so first. You can download Node.js from the [official website](https://nodejs.org/). The Node.js installer includes npm, so installing Node.js should give you both.

#### 2. Check your package.json file

The package.json file should be in the root directory of your project. Open it and look for a `scripts` section. It might look something like this:

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
},
```

### 3. Prepare and upload your website content to the S3 bucket:

- Before uploading your website content, it's crucial to prepare your web application for production. In many web development workflows that involve Node.js (a JavaScript runtime) and npm (Node.js package manager), the `npm run build` command is used. This command executes a script that you define in your `package.json` file, usually involving transforming and optimizing your code for production. The result of this build process is a set of static files (HTML, CSS, JavaScript) that can be served to your users.
- Navigate to your project directory in the terminal and run `npm install` to install the necessary dependencies specified in your `package.json` file.
- Run `npm run build` to create an optimized build of your application. Depending on your setup, this will create a `build` or `dist` directory with the files to upload to your S3 bucket.
- Once your build is successful, log into the AWS Management Console, go to the S3 service, and navigate to the bucket you created.
- Click 'Upload', and then add the files from your build directory. Make sure to include all the files and keep the directory structure intact as it's essential for correct routing of your website.
- Start the upload. Once the process is complete, your website content will be in the S3 bucket and ready to be served.

The `npm run build` command is an important step in your web development process because it prepares your web application for production. During development, your code is usually not optimized for performance and may include development-specific features that should not be in the production environment (like console logs, development server configurations, etc.). The build process strips away these development features and optimizes the code to improve loading and execution speed in a user's browser, which contributes to a better user experience.

### 4. Configure the S3 bucket for Static Website Hosting:

- In the S3 bucket properties, enable "Static Website Hosting".
- Set the "Index Document" to your main HTML page (usually "index.html").

### 5. Create a CloudFront distribution:

- Navigate to the CloudFront service in the AWS Management Console and click "Create Distribution".
- Then, click "Get Started" under the "Web" section.
- In the "Origin Domain Name" you'll see a dropdown list of your S3 buckets. Select the bucket that you want to connect with CloudFront.
- The "Origin Path" field can usually be left blank.
- For the "Viewer Protocol Policy", choose "Redirect HTTP to HTTPS" to ensure secure connections.
- Set the "Allowed HTTP Methods" to "GET, HEAD".
- In the "Default Root Object" field, enter the name of your index document (usually index.html).
- Leave the remaining settings at their defaults and click "Create Distribution".

### 6. Register a Domain:

- If you haven't already, you'll need to register a domain name with a domain registrar. There are many providers out there, and AWS also offers this service through Route 53.

### 7. Request a Public Certificate in AWS Certificate Manager (ACM):

- Navigate to the ACM service in the AWS Management Console.
- Click on "Request a certificate".
- Choose "Request a public certificate" then click "Request a certificate".
- Add your domain names. You can add multiple names for the same certificate.
- Click "Next", choose "DNS validation" and then "Review".
- Review the information and then "Confirm and request".

### 8. Validate the Certificate:

- After the certificate is requested, click on the domain name you just requested a certificate for.
- Expand the domain name, and you will see the DNS records that you have to add to your domain.
- Navigate to Route53 (or your DNS provider) and create a new CNAME record with the information provided by ACM.
- After adding the DNS records, the status of the certificate should change to "Issued" in a few minutes/hours.

### 9. Adding a CNAME to CloudFront Distribution:

- Navigate back to your CloudFront distribution.
- Click on the ID of your distribution and then on the "Edit" button.
- In the "Alternate Domain Names (CNAMEs)" field, add your custom domain name.
- In the "SSL Certificate", select "Custom SSL Certificate (example.com)" and select your ACM certificate from the dropdown list.
- Click on "Yes, Edit".

### 10. Route53 configuration:

- Navigate to the Route 53 service in the AWS Management Console.
- If you haven't already, create a hosted zone with the same name as your domain.
- Click on "Create Record Set".
- Leave the "Name" field blank (if you want to use the root domain), or add a subdomain.
- Choose "Alias" to "Yes".
- In "Alias Target", add the CloudFront distribution domain name.
- Click "Create".

### 11. Modify Bucket Policy:

- Add a bucket policy that makes your bucket content publicly readable.
- To update the bucket policy for your S3 bucket to allow CloudFront to access your S3 bucket content, you need to add a policy which grants the necessary permissions to the CloudFront origin access identity that's associated with your distribution.

#### Step 1: Create an Origin Access Identity (OAI)

1.  Navigate to the CloudFront service in the AWS Management Console.
2.  In the left navigation pane, choose "Origin Access Identity" under the "Security" section.
3.  Click "Create Origin Access Identity".
4.  Enter a comment to describe the OAI (optional), then click "Create".

#### Step 2: Attach OAI to your CloudFront distribution

1.  Navigate to your CloudFront distribution.
2.  Click on the "ID" of your distribution and then on the "Edit" button.
3.  In the "Origins and Origin Groups" tab, choose your S3 bucket, and then click "Edit".
4.  In the "Restrict Bucket Access" field, select "Yes".
5.  In the "Origin Access Identity", select "Use an Existing Identity".
6.  Choose the OAI you just created.
7.  In "Grant Read Permissions on Bucket", choose "Yes, Update Bucket Policy".
8.  Click "Yes, Edit".

#### Step 3: Update your S3 bucket policy

The last step is to update your S3 bucket policy to give this OAI permission to access your bucket. But if you chose "Yes, Update Bucket Policy" in the last step of Step 2, AWS should have done this automatically for you. If you need to do it manually, follow these steps:

1.  In the S3 console, navigate to your bucket.
2.  Go to the "Permissions" tab.
3.  Under "Bucket Policy", click "Edit".
4.  Here, you will add a new Statement to the existing bucket policy, which looks like this (replace "YOUR_BUCKET_NAME" with the name of your bucket, and "OAI_ID" with the ID of the OAI you created):

```json
{
  "Version": "2012-10-17",
  "Id": "PolicyForCloudFrontPrivateContent",
  "Statement": [
    {
      "Sid": "1",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity OAI_ID"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

### 12. Update your domain's nameservers at Namecheap:

- In Namecheap, update your domain to use the custom DNS provided by Route 53.

As always, please remember that while AWS provides a free tier, certain services and usage levels may incur charges. Always monitor your usage to avoid unexpected costs. AWS provides a number of tools and resources for tracking and managing costs.
