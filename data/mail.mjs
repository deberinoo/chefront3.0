import nodemailer 						from 'nodemailer';
import { google } 						from 'googleapis';

const CLIENT_ID = '393014126046-dt545klaqnl5gielf5p7ojur8eteb12v.apps.googleusercontent.com'
const CLIENT_SECRET = '4LuT41xbxevZMo1lWhSPww5G'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04HY6OyEr55krCgYIARAAGAQSNwF-L9IrT3N7JGmvY1dks9jqHztgyPJ0pmRD9pcaHItU5upTnq4N_wDIvs5IS01nQIQkPlvuVo8'

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
			subject: 'Chefront Email Confirmation',
			text: 'Hello from the CEO',
			html: `
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			  <tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; color: black; border-radius: 3px;">
		
					  <!-- START MAIN CONTENT AREA -->
					  <tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hey there!</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We're thrilled to have you join us! Get ready to dive into your new account.</p>
								<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
								  <tbody>
									<tr>
									  <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
										<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
										  <tbody>
											<tr>
											  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <p style="display: inline-block; color: #ffffff; background-color: #f55767; border: solid 1px #f55767; border-radius: 5px; box-sizing: border-box; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #f55767;">${code}</p> </td>
											</tr>
										  </tbody>
										</table>
									  </td>
									</tr>
								  </tbody>
								</table>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Cheers, <br>Chefront Team</p>
							  </td>
							</tr>
						  </table>
						</td>
					  </tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
					  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
						  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
						  </td>
						</tr>
					  </table>
					</div>
					<!-- END FOOTER -->
		
				  <!-- END CENTERED WHITE CONTAINER -->
				  </div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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

export async function sendMailVerifiedBusiness(email) {
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
			subject: 'Chefront Email Confirmation',
			text: 'Hello from the CEO',
			html: `
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			  <tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
		
					  <!-- START MAIN CONTENT AREA -->
					  <tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hey there!</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We're thrilled to have you join us! Get ready to dive into your new account.</p>
								<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
								  <tbody>
									<tr>
									  <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
										<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
										  <tbody>
											<tr>
											  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <p style="display: inline-block; color: #ffffff; background-color: #f55767; border: solid 1px #f55767; border-radius: 5px; box-sizing: border-box; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #f55767;">${email}</p> </td>
											</tr>
										  </tbody>
										</table>
									  </td>
									</tr>
								  </tbody>
								</table>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Cheers, <br>Chefront</p>
							  </td>
							</tr>
						  </table>
						</td>
					  </tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
					  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
						  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
						  </td>
						</tr>
					  </table>
					</div>
					<!-- END FOOTER -->
		
				  <!-- END CENTERED WHITE CONTAINER -->
				  </div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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
			html:`
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
				<tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
					<div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; color: black; border-radius: 3px;">
		
						<!-- START MAIN CONTENT AREA -->
						<tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
							<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
								<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hey there,</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We're sorry to see you go, the following account has been deleted:</p>
								<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
									<tbody>
									<tr>
										<td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
										<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
											<tbody>
											<tr>
												<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <p style="display: inline-block; color: #ffffff; background-color: #f55767; border: solid 1px #f55767; border-radius: 5px; box-sizing: border-box; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #f55767;">${email}</p> </td>
											</tr>
											</tbody>
										</table>
										</td>
									</tr>
									</tbody>
								</table>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Cheers, <br>Chefront Team</p>
								</td>
							</tr>
							</table>
						</td>
						</tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
						<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
							<td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
							</td>
						</tr>
						</table>
					</div>
					<!-- END FOOTER -->
		
					<!-- END CENTERED WHITE CONTAINER -->
					</div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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

export async function sendMailPayment(name, email) {
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
			subject: 'We have received your deposit!',
			text: 'Hello from the CEO',
			html: `
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			  <tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; color: black; border-radius: 3px;">
		
					  <!-- START MAIN CONTENT AREA -->
					  <tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hey there, ${name}!</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have received your deposit of $15! Thank you for choosing to book with Chefront.</p>
							  </td>
							</tr>
							<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Cheers, <br>Chefront Team</p>
						  </table>
						</td>
					  </tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
					  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
						  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
						  </td>
						</tr>
					  </table>
					</div>
					<!-- END FOOTER -->
		
				  <!-- END CENTERED WHITE CONTAINER -->
				  </div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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

export async function sendMailMakeReservation(email,code,name,location,user_name,date,pax,time,discount) {
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
			subject: 'Your reservation is successful!',
			text: 'Hello from the CEO',
			html: `
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			  <tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; color: black; border-radius: 3px;">
		
					  <!-- START MAIN CONTENT AREA -->
					  <tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your reservation at ${name} at ${location} is successful! Here is your reservation code:</p>
								<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
								  <tbody>
									<tr>
									  <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
										<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
										  <tbody>
											<tr>
											  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <p style="display: inline-block; color: #ffffff; background-color: #f55767; border: solid 1px #f55767; border-radius: 5px; box-sizing: border-box; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #f55767;">${code}</p> </td>
											</tr>
										  </tbody>
										</table>
									  </td>
									</tr>
								  </tbody>
								</table>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Name: ${user_name}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Date: ${date}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Pax: ${pax}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Time & Discount: ${time} / ${discount}%</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Cheers, <br>Chefront Team</p>
							  </td>
							</tr>
						  </table>
						</td>
					  </tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
					  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
						  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
						  </td>
						</tr>
					  </table>
					</div>
					<!-- END FOOTER -->
		
				  <!-- END CENTERED WHITE CONTAINER -->
				  </div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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

export async function sendMailDeleteReservation(email,code,name,location,user_name,date,pax,time,discount) {
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
			subject: 'Your reservation has been cancelled',
			text: 'Hello from the CEO',
			html:`
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			  <tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; color: black; border-radius: 3px;">
		
					  <!-- START MAIN CONTENT AREA -->
					  <tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your reservation has been cancelled!</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your reservation at ${name} at ${location} has been cancelled. Here is its reservation code:</p>
								<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
								  <tbody>
									<tr>
									  <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
										<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
										  <tbody>
											<tr>
											  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <p style="display: inline-block; color: #ffffff; background-color: #f55767; border: solid 1px #f55767; border-radius: 5px; box-sizing: border-box; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #f55767;">${code}</p> </td>
											</tr>
										  </tbody>
										</table>
									  </td>
									</tr>
								  </tbody>
								</table> 
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Name: ${user_name}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Date: ${date}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Pax: ${pax}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Time & Discount: ${time} / ${discount}%</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Cheers, <br>Chefront Team</p>
							  </td>
							</tr>
						  </table>
						</td>
					  </tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
					  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
						  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
						  </td>
						</tr>
					  </table>
					</div>
					<!-- END FOOTER -->
		
				  <!-- END CENTERED WHITE CONTAINER -->
				  </div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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
			subject: 'Your Chefront account has been banned',
			text: 'Hello from the CEO',
			html: `
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			  <tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; color: black; border-radius: 3px;">
		
					  <!-- START MAIN CONTENT AREA -->
					  <tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello,</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have closed this account because our records show that you do not meet the terms of our Conditions of Use agreement.</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sincerely, <br>Chefront Team</p>
							  </td>
							</tr>
						  </table>
						</td>
					  </tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
					  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
						  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
						  </td>
						</tr>
					  </table>
					</div>
					<!-- END FOOTER -->
		
				  <!-- END CENTERED WHITE CONTAINER -->
				  </div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			  <tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; color: black; border-radius: 3px;">
		
					  <!-- START MAIN CONTENT AREA -->
					  <tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hey there!</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your feedback has been well received. Here is our response.</p>
								<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
								  <tbody>
									<tr>
									  <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
										<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
										  <tbody>
											<tr>
											  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <p style="display: inline-block; color: #ffffff; background-color: #ffffff; border: solid 1px #ffffff; border-radius: 5px; box-sizing: border-box; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #f55767;">${response}</p> </td>
											</tr>
										  </tbody>
										</table>
									  </td>
									</tr>
								  </tbody>
								</table>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Cheers, <br>Chefront</p>
							  </td>
							</tr>
						  </table>
						</td>
					  </tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
					  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
						  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
						  </td>
						</tr>
					  </table>
					</div>
					<!-- END FOOTER -->
		
				  <!-- END CENTERED WHITE CONTAINER -->
				  </div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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
			subject: 'Reset Password',
			text: 'Hello from the CEO',
			html: `
			<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			  <tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
		
					<!-- START CENTERED WHITE CONTAINER -->
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; color: black; border-radius: 3px;">
		
					  <!-- START MAIN CONTENT AREA -->
					  <tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hey there!</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You requested for a password reset, kindly use the link below to reset your password:</p>
								<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
								  <tbody>
									<tr>
									  <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
										<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
										  <tbody>
											<tr>
											<td align="center" style="border-radius: 3px;" bgcolor="#f55767"><a href="http://localhost:3000/auth/resetPassword/${email}" target="_blank" style="font-size: 20px; font-family: 'Nunito', sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Link</td>
											</tr>
										  </tbody>
										</table>
									  </td>
									</tr>
								  </tbody>
								</table>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Cheers, <br>Chefront</p>
							  </td>
							</tr>
						  </table>
						</td>
					  </tr>
		
					<!-- END MAIN CONTENT AREA -->
					</table>
		
					<!-- START FOOTER -->
					<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
					  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
						<tr>
						  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
							<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright © 2021 Chefront Singapore All Rights Reserved.</span>
						  </td>
						</tr>
					  </table>
					</div>
					<!-- END FOOTER -->
		
				  <!-- END CENTERED WHITE CONTAINER -->
				  </div>
				</td>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
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