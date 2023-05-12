import type { NextApiRequest, NextApiResponse } from 'next'

const mailchimpClient = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

type Data = {
  error?: string,
  data?: {
    isSubscribed: boolean,
    message?: string,
  } 
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  const email = request.query.email;
  if (!email) {
    response.status(500).json({ error: 'Email required' });
  }
  const mcResponse = await mailchimpClient.rejects.list({ email, include_expired: false });
  
  if (mcResponse.isAxiosError) {
    response.status(500).json({ error: mcResponse?.response?.data?.message });
  }

  const isSubscribed = mcResponse.length === 0;
  const message = mcResponse.length === 0 ? null : mcResponse[0]?.reason;
  response.status(200).json({ data: { isSubscribed, message } });
}