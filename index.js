const User = require("./models/userModel");
const UserVerification = require("./models/userVerificationModel");
const logger = require("./services/logger");

require("dotenv").config();
const functions = require("@google-cloud/functions-framework");
const apiKey = process.env.API_KEY;
const domain = process.env.DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: apiKey, domain: domain });

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent("verifyEmailPubsub", async (cloudEvent) => {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const username = Buffer.from(cloudEvent.data.message.data, "base64")
    .toString("utf-8")
    .replaceAll('"', "");
  logger.info({
    message: "Received message",
    username: username,
    api: "verifyEmailPubsub",
  });

  const user = User.findOne({
    where: {
      username: username,
    },
  });

  if (!user || user.username === null) {
    logger.error({
      message: "User not found",
      username: username,
      api: "verifyEmailPubsub",
    });
    return;
  }

  logger.info({
    message: "User found",
    username: username,
    api: "verifyEmailPubsub",
  });

  createVerificationEntry(username);
});

const createVerificationEntry = async (
  username,
) => {
  // create a new entry in userVerification table
  UserVerification.create({
    username_fk: username,
    email_sent_time: new Date(),
  })
    .then((entry) => {
      logger.info({
        message: "Verification entry created successfully",
        entry: entry,
        api: "createVerificationEntry",
      });
      // User-defined function to send email
      sendMail(username, entry.token);
    })
    .catch((error) => {
      logger.error({
        message: "Could not create verification entry",
        error: error,
        api: "createVerificationEntry",
      });
    });
};

sendMail = function (receiver_email, token) {
  const sender_email = "verify@megamindcorp.me";
  const email_subject = "Verify Your Email Address";

  const data = {
    from: sender_email,
    to: receiver_email,
    subject: email_subject,
    html: `<!DOCTYPE html>
		<html
			lang="en"
			dir="ltr"
			xmlns:v="urn:schemas-microsoft-com:vml"
			xmlns:o="urn:schemas-microsoft-com:office:office"
			style="color-scheme: light dark; supported-color-schemes: light dark"
		>
			<head>
				<meta charset="utf-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1 user-scalable=yes"
				/>
				<meta
					name="format-detection"
					content="telephone=no, date=no, address=no, email=no, url=no"
				/>
				<meta name="x-apple-disable-message-reformatting" />
				<meta name="color-scheme" content="light dark" />
				<meta name="supported-color-schemes" content="light dark" />
				<title></title>
				<!--[if mso]>
					<noscript
						><xml
							><o:OfficeDocumentSettings
								><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings
							></xml
						></noscript
					>
				<![endif]-->
				<!--[if mso]>
					<style>
						table,
						tr,
						td,
						p,
						span,
						a {
							mso-line-height-rule: exactly !important;
							line-height: 120% !important;
							mso-table-lspace: 0 !important;
							mso-table-rspace: 0 !important;
						}
					</style>
				<![endif]-->
				<style>
					a[x-apple-data-detectors] {
						color: inherit !important;
						text-decoration: none !important;
						font-size: inherit !important;
						font-family: inherit !important;
						font-weight: inherit !important;
						line-height: inherit !important;
					}
					u + #body a {
						color: inherit !important;
						text-decoration: none !important;
						font-size: inherit !important;
						font-family: inherit !important;
						font-weight: inherit !important;
						line-height: inherit !important;
					}
					#MessageViewBody a {
						color: inherit !important;
						text-decoration: none !important;
						font-size: inherit !important;
						font-family: inherit !important;
						font-weight: inherit !important;
						line-height: inherit !important;
					}
					:root {
						color-scheme: light dark;
						supported-color-schemes: light dark;
					}
					tr {
						vertical-align: middle;
					}
					p,
					a,
					li {
						color: #000000;
						font-size: 16px;
						mso-line-height-rule: exactly;
						line-height: 24px;
						font-family: Arial, sans-serif;
					}
					p:first-child {
						margin-top: 0 !important;
					}
					p:last-child {
						margin-bottom: 0 !important;
					}
					a {
						text-decoration: underline;
						font-weight: bold;
						color: #0000ff;
					}
					@media only screen and (max-width: 599px) {
						.full-width-mobile {
							width: 100% !important;
							height: auto !important;
						}
						.mobile-padding {
							padding-left: 10px !important;
							padding-right: 10px !important;
						}
						.mobile-stack {
							display: block !important;
							width: 100% !important;
						}
					}
					@media (prefers-color-scheme: dark) {
						body,
						div,
						table,
						tr,
						td {
							background-color: #000000 !important;
							color: #ffffff !important;
						}
						.content {
							background-color: #222222 !important;
						}
						p,
						li {
							color: #b3bdc4 !important;
						}
						a {
							color: #84cfe2 !important;
						}
					}
				</style>
			</head>
			<body class="body" style="background-color: #f4f4f4">
				<div
					style="
						display: none;
						font-size: 1px;
						color: #f4f4f4;
						line-height: 1px;
						max-height: 0px;
						max-width: 0px;
						opacity: 0;
						overflow: hidden;
					"
				></div>
				<span
					style="
						display: none !important;
						visibility: hidden;
						mso-hide: all;
						font-size: 1px;
						line-height: 1px;
						max-height: 0px;
						max-width: 0px;
						opacity: 0;
						overflow: hidden;
					"
				>
					&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</span
				>
				<div
					role="article"
					aria-roledescription="email"
					aria-label="Your Email"
					lang="en"
					dir="ltr"
					style="
						font-size: 16px;
						font-size: 1rem;
						font-size: max(16px, 1rem);
						background-color: #f4f4f4;
					"
				>
					<table
						align="center"
						role="presentation"
						border="0"
						cellpadding="0"
						cellspacing="0"
						width="100%"
						style="
							border-collapse: collapse;
							max-width: 600px;
							width: 100%;
							background-color: #f4f4f4;
						"
					>
						<tr style="vertical-align: middle" valign="middle">
							<td>
								<!--[if mso]>
		<table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;"><tr><td align="center">
		<!--<![endif]-->
							</td>
						</tr>
						<tr style="vertical-align: middle" valign="middle">
							<td align="center" style="padding: 30px 0">
								<table
									align="center"
									role="presentation"
									border="0"
									cellpadding="0"
									cellspacing="0"
									width="600"
									style="
										border-collapse: collapse;
										max-width: 600px;
										width: 100%;
										background-color: #fffffe;
									"
								>
									<tr style="vertical-align: middle" valign="middle">
										<td align="center" style="padding: 30px" class="content">
											<table
												align="center"
												role="presentation"
												border="0"
												cellpadding="0"
												cellspacing="0"
												width="600"
												style="
													border-collapse: collapse;
													max-width: 600px;
													width: 100%;
													background-color: #fffffe;
												"
											>
												<tr style="vertical-align: middle" valign="middle">
													<td class="content">
														<p
															style="
																color: #000000;
																font-size: 16px;
																mso-line-height-rule: exactly;
																line-height: 24px;
																font-family: Arial, sans-serif;
																margin-top: 0 !important;
															"
														>
															Please confirm your email address by clicking the
															link&nbsp;below.
														</p>
														<p
															style="
																color: #000000;
																font-size: 16px;
																mso-line-height-rule: exactly;
																line-height: 24px;
																font-family: Arial, sans-serif;
															"
														>
															This link is valid for only 2 minutes.
														</p>
														<p
															style="
																color: #000000;
																font-size: 16px;
																mso-line-height-rule: exactly;
																line-height: 24px;
																font-family: Arial, sans-serif;
															"
														>
															<a
																href="${env.process.VERIFY_URL + token}"
																style="
																	font-size: 16px;
																	mso-line-height-rule: exactly;
																	line-height: 24px;
																	font-family: Arial, sans-serif;
																	text-decoration: underline;
																	font-weight: bold;
																	color: #0000ff;
																"
																>Confirm email&nbsp;address</a
															>
														</p>
														<p
															style="
																color: #000000;
																font-size: 16px;
																mso-line-height-rule: exactly;
																line-height: 24px;
																font-family: Arial, sans-serif;
																margin-bottom: 0 !important;
															"
														>
															&mdash; MegaMindCorp
														</p>
													</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>
								<table
									align="center"
									role="presentation"
									border="0"
									cellpadding="0"
									cellspacing="0"
									width="600"
									style="border-collapse: collapse; max-width: 600px; width: 100%"
								>
									<tr style="vertical-align: middle" valign="middle">
										<td align="center" style="padding-top: 30px">
											<p
												style="
													mso-line-height-rule: exactly;
													line-height: 24px;
													font-family: Arial, sans-serif;
													font-size: 14px;
													color: #999;
													margin-top: 0 !important;
													margin-bottom: 0 !important;
												"
											>
												Follow
												<a
													href="http://twitter.com/mail_gun"
													style="
														mso-line-height-rule: exactly;
														line-height: 24px;
														font-family: Arial, sans-serif;
														text-decoration: underline;
														font-weight: bold;
														font-size: 14px;
														color: #999;
													"
													>@Mail_Gun</a
												>
												on&nbsp;Twitter.
											</p>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<!--[if mso]>
		</td></tr></table>
		<!--<![endif]-->
					</table>
				</div>
			</body>
		</html>
		`,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error)
      logger.error({ message: "Could not send email", error, api: "sendMail" });
    else logger.info({ message: "Email sent", api: "sendMail" });
  });
};
