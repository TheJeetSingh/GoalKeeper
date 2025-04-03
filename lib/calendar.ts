import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Types } from 'mongoose';
import { User } from '@/models/User';
import { Commitment } from '@/models/Commitment';

interface CalendarEvent {
  id?: string;
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
  reminders: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
}

interface IAuthMethod {
  provider: string;
  providerId: string;
}

class CalendarService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Initialize Google Calendar API
  private getCalendarApi(accessToken: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    return google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  // Sync commitment to calendar
  async syncCommitmentToCalendar(userId: Types.ObjectId, commitmentId: Types.ObjectId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.authMethods.find((m: IAuthMethod) => m.provider === 'google')) {
        throw new Error('User not found or Google Calendar not connected');
      }

      const commitment = await Commitment.findById(commitmentId);
      if (!commitment) {
        throw new Error('Commitment not found');
      }

      const googleAuth = user.authMethods.find((m: IAuthMethod) => m.provider === 'google');
      const calendar = this.getCalendarApi(googleAuth?.providerId || '');

      const event: CalendarEvent = {
        summary: commitment.title,
        description: commitment.description || '',
        start: {
          dateTime: commitment.startDate.toISOString(),
        },
        end: {
          dateTime: commitment.dueDate.toISOString(),
        },
        reminders: {
          useDefault: false,
          overrides: commitment.reminders.map((r: { type: string; time: Date }) => ({
            method: r.type === 'email' ? 'email' : 'popup',
            minutes: Math.floor((r.time.getTime() - commitment.startDate.getTime()) / 60000)
          }))
        }
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      // Update commitment with calendar event ID
      await Commitment.findByIdAndUpdate(commitmentId, {
        $set: {
          'metadata.calendarEventId': response.data.id
        }
      });

      return response.data;
    } catch (error) {
      console.error('Calendar sync error:', error);
      throw error;
    }
  }

  // Update calendar event for commitment
  async updateCalendarEvent(userId: Types.ObjectId, commitmentId: Types.ObjectId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.authMethods.find((m: IAuthMethod) => m.provider === 'google')) {
        throw new Error('User not found or Google Calendar not connected');
      }

      const commitment = await Commitment.findById(commitmentId);
      if (!commitment) {
        throw new Error('Commitment not found');
      }

      const googleAuth = user.authMethods.find((m: IAuthMethod) => m.provider === 'google');
      const calendar = this.getCalendarApi(googleAuth?.providerId || '');

      const event: CalendarEvent = {
        id: commitment.metadata?.calendarEventId,
        summary: commitment.title,
        description: commitment.description || '',
        start: {
          dateTime: commitment.startDate.toISOString(),
        },
        end: {
          dateTime: commitment.dueDate.toISOString(),
        },
        reminders: {
          useDefault: false,
          overrides: commitment.reminders.map((r: { type: string; time: Date }) => ({
            method: r.type === 'email' ? 'email' : 'popup',
            minutes: Math.floor((r.time.getTime() - commitment.startDate.getTime()) / 60000)
          }))
        }
      };

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: commitment.metadata?.calendarEventId,
        requestBody: event
      });

      return response.data;
    } catch (error) {
      console.error('Calendar update error:', error);
      throw error;
    }
  }

  // Delete calendar event
  async deleteCalendarEvent(userId: Types.ObjectId, commitmentId: Types.ObjectId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.authMethods.find((m: IAuthMethod) => m.provider === 'google')) {
        throw new Error('User not found or Google Calendar not connected');
      }

      const commitment = await Commitment.findById(commitmentId);
      if (!commitment || !commitment.metadata?.calendarEventId) {
        throw new Error('Commitment or calendar event not found');
      }

      const googleAuth = user.authMethods.find((m: IAuthMethod) => m.provider === 'google');
      const calendar = this.getCalendarApi(googleAuth?.providerId || '');

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: commitment.metadata.calendarEventId,
      });

      // Remove calendar event ID from commitment
      await Commitment.findByIdAndUpdate(commitmentId, {
        $unset: {
          'metadata.calendarEventId': 1
        }
      });

      return true;
    } catch (error) {
      console.error('Calendar delete error:', error);
      throw error;
    }
  }

  // Get available time slots
  async getAvailableTimeSlots(userId: Types.ObjectId, startDate: Date, endDate: Date) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.authMethods.find((m: IAuthMethod) => m.provider === 'google')) {
        throw new Error('User not found or Google Calendar not connected');
      }

      const googleAuth = user.authMethods.find((m: IAuthMethod) => m.provider === 'google');
      const calendar = this.getCalendarApi(googleAuth?.providerId || '');

      const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      // Convert busy times to free times
      const busyTimes = events.data.items?.map(event => ({
        start: new Date(event.start?.dateTime || event.start?.date || ''),
        end: new Date(event.end?.dateTime || event.end?.date || ''),
      })) || [];

      const freeSlots = [];
      let currentTime = new Date(startDate);

      for (const busy of busyTimes) {
        if (currentTime < busy.start) {
          freeSlots.push({
            start: currentTime,
            end: busy.start,
          });
        }
        currentTime = busy.end;
      }

      if (currentTime < endDate) {
        freeSlots.push({
          start: currentTime,
          end: endDate,
        });
      }

      return freeSlots;
    } catch (error) {
      console.error('Get available slots error:', error);
      throw error;
    }
  }
}

export const calendarService = new CalendarService(); 