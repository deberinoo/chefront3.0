import nodemailer 						from 'nodemailer';
import { google } 						from 'googleapis';

const CLIENT_ID = '393014126046-dt545klaqnl5gielf5p7ojur8eteb12v.apps.googleusercontent.com'
const CLIENT_SECRET = 'YY2805v_pjVSlpTCPz8PJJ0b'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//044RRXUejfG49CgYIARAAGAQSNwF-L9Ir4uNYwb7t44fXCeHlAlALAn0NHzoG9mppSHmUEWMgGeto7C1LJ0NbdwoGcfnRHCDXMIo'

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

export async function sendMailDeleteUser(email) {
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
			subject: 'Deletion of Chefront account',
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> </div>
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
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Goodbye!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
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
									<p style="margin: 0;">We're sorry to see you go, the account below has been deleted: </p>
								</td>
							</tr>
							<tr>
								<td bgcolor="#ffffff" align="left">
									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tr>
											<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
												<table border="0" cellspacing="0" cellpadding="0">
													<tr>
														<td align="center" style="border-radius: 3px;" bgcolor="#f55767"><a href="#" target="_blank" style="font-size: 20px; font-family: 'Nunito', sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">${email}</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr> 
							<tr>
								<td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
									<p style="margin: 0;">Farewell,<br>Chefront Team</p>
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

export async function sendMailUpdateUser(email,name,contact,password ) {
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
			subject: 'Updating of user account',
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Update!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
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
									<p style="margin: 0;">Below are your new credentials </p>
								</td>
							</tr>
							<tr>
								<td bgcolor="#ffffff" align="left">
									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tr>
											<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
												<table border="0" cellspacing="0" cellpadding="0">
													<tr>
														<td align="center" style="border-radius: 3px;" bgcolor="#f55767"><a href="#" target="_blank" style="font-size: 20px; font-family: 'Nunito', sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Name : ${name}<br> Email: ${email}<br> Contact: ${contact}<br> Password: ${password}</td>
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

export async function sendMailMakeReservation(email,code) {
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
			subject: 'E-receipt of reservation',
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Greetings!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
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
									<p style="margin: 0;">Below is your reservation code:</p>
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

export async function sendMailDeleteReservation(email,code) {
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
			subject: 'Deletion of reservation',
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Greetings!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
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
									<p style="margin: 0;">Below is the reservation that has been deleted:</p>
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

export async function sendMailCreateOutlet(email,business_name) {
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
			subject: `Creating of Outlet for ${business_name}`,
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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

export async function sendMailUpdateOutlet(email,busines_name,name,location,address,postal_code,price,contact,description,thumbnail) {
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
			subject: `Creating of Outlet for ${business_name}`,
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Update!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
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
									<p style="margin: 0;">Below are the new credentials for ${name}</p>
								</td>
							</tr>
							<tr>
								<td bgcolor="#ffffff" align="left">
									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tr>
											<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
												<table border="0" cellspacing="0" cellpadding="0">
													<tr>
														<td align="center" style="border-radius: 3px;" bgcolor="#f55767"><a href="#" target="_blank" style="font-size: 20px; font-family: 'Nunito', sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Name: ${name}<br> Location: ${location} <br> Address: ${address} <br> Postal Code: ${postal_code}<br> Price: ${price} <br> Contact: ${contact} <br> Description: ${description}<br> Thumbnail: ${thumbnail}</td>
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


export async function sendMailDeleteOutlet(email,business_name,name) {
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
			subject: `Deletion of Outlet for ${business_name}`,
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Bye ${name}!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
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
									<p style="margin: 0;">The outlet below for ${business_name} has been removed </p>
								</td>
							</tr>
							<tr>
								<td bgcolor="#ffffff" align="left">
									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tr>
											<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
												<table border="0" cellspacing="0" cellpadding="0">
													<tr>
														<td align="center" style="border-radius: 3px;" bgcolor="#f55767"><a href="#" target="_blank" style="font-size: 20px; font-family: 'Nunito', sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">${business_name}</td>
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



export async function sendMailBannedAccount(email) {
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
			subject: 'Account ban',
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Banned!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
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
									<p style="margin: 0;">You have not been attending your reservations, as such you have now been banned </p>
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
									<p style="margin: 0;">Farewell,<br>Chefront Team</p>
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

export async function sendMailFeedbackResponse(email,response) {
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
			subject: 'Feedback Response',
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
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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
									<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Hello!</h1> <img src="https://img.icons8.com/ios/100/000000/handshake--v1.png" width="125" height="120" style="display: block; border: 0px;" />
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
									<p style="margin: 0;">We have recieved your feedback and below is our response: </p>
								</td>
							</tr>
							<tr>
								<td bgcolor="#ffffff" align="left">
									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tr>
											<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
												<table border="0" cellspacing="0" cellpadding="0">
													<tr>
														<td align="center" style="border-radius: 3px;" bgcolor="#f55767"><a href="#" target="_blank" style="font-size: 20px; font-family: 'Nunito', sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">${response}</td>
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
			html: `
			<style>
			@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
			</style>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet">
			<body style="background-color: #f55767; margin: 0 !important; padding: 0 !important;">
			<!-- HIDDEN PREHEADER TEXT -->
			<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
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
									<p style="margin: 0;">	<p>You requested for a password reset, kindly use the link below to reset your password</p>
									</p>
								</td>
							</tr>
							<tr>
								<td bgcolor="#ffffff" align="left">
									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tr>
											<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
												<table border="0" cellspacing="0" cellpadding="0">
													<tr>
														<td align="center" style="border-radius: 3px;" bgcolor="#f55767"><a href="http://localhost:3000/auth/resetPassword/${email}" target="_blank" style="font-size: 20px; font-family: 'Nunito', sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Link</td>
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
