import nodemailer 						from 'nodemailer';
import { google } 						from 'googleapis';

const CLIENT_ID = '393014126046-dt545klaqnl5gielf5p7ojur8eteb12v.apps.googleusercontent.com'
const CLIENT_SECRET = 'Z5O9RwV9KoOooQi6OAg0o8XK'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04ZoGJhDAAyXiCgYIARAAGAQSNwF-L9Ir7F5Q__mPxkm4ODFc-xElOIYmBiqaLQgRNgWLQ5zcauw64wqIZGinicUIUXvM8RVsSsM'

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendMail(email,code) {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'chefrontceo@gmail.com',
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: 'chefrontceo@gmail.com',
			to: email,
			subject: 'Chefront Email Confirmation ',
			text: 'Hello from the CEO',
			html: `
			<style>
			@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
			</style>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet">
			<body style="background-color: #f55767; margin: 0 !important; padding: 0 !important;">
			<!-- HIDDEN PREHEADER TEXT -->
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
			<table border="0" cellpadding="0" cellspacing="0" width="100%">
				<!-- LOGO -->
				<tr>
					<td bgcolor="#f55767" align="center">
						<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
							<tr>
								<td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td bgcolor="#f55767" align="center" style="padding: 0px 10px 0px 10px;">
						<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
							<tr>
								<td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Helvetica, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
						<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
							<tr>
								<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 10px 30px; color: #666666; font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
									<p style="margin: 0;">We're excited to get you started. Here is your confirmation code: </p>
								</td>
							</tr>
							<tr>
								<td bgcolor="#ffffff" align="left">
									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tr>
											<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
												<table border="0" cellspacing="0" cellpadding="0">
													<tr>
														<td align="center" style="border-radius: 3px;" bgcolor="#f55767"><a href="#" target="_blank" style="font-size: 20px; font-family: 'Nunito', sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">${code}</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr> 
							<tr>
								<td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
									<p style="margin: 0;">Cheers,<br>Chefront Team</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</body>`,
		};

		const result = await transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
}

export async function sendMailPasswordChange(email) {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'chefrontceo@gmail.com',
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: 'chefrontceo@gmail.com',
			to: email,
			subject: 'Forget Password Email',
			text: 'Hello from the CEO',
			html: `<p>You requested for a password reset, kindly use this <a href='http://localhost:3000/auth/resetPasswordCustomer/${email}'>Link</a> to reset your password</p>`,
		};

		const result = await transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
}

export async function sendMailPasswordChangeBusiness(email) {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'chefrontceo@gmail.com',
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: 'chefrontceo@gmail.com',
			to: email,
			subject: 'Forget Password Email',
			text: 'Hello from the CEO',
			html: `<p>You requested for a password reset, kindly use this <a href='http://localhost:3000/auth/resetPasswordBusiness/${email}'>Link</a> to reset your password</p>`,
		};

		const result = await transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
}
