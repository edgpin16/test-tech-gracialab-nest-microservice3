import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailingService {
  constructor(
  ) {}
  
  public async sendMail(email : string) {

    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const smtpTransport = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user : process.env.EMAIL,
        clientId : process.env.CLIENT_ID,
        clientSecret : process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken
      }
    });

    const mailOptions = {
      from: "noreply@gmail.com",
      to: email,
      subject: "Confirmacion de reserva",
      generateTextFromHTML: true,
      html: "<h1>Tu reserva ha sido confirmada</h1>"
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log(response);
      smtpTransport.close();
    });
  }
}