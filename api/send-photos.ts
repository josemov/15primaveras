import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { guestName, guestEmail, photos, targetEmail } = req.body;

    // photos debe ser un array de objetos { filename, content (base64) }
    
    const attachments = photos.map((photo: any) => ({
      filename: photo.filename,
      content: photo.content,
    }));

    const { data, error } = await resend.emails.send({
      from: 'Buzón de 15 <fotos@resend.dev>', // Usar dominio verificado en prod
      to: [targetEmail],
      subject: `Nuevas fotos de ${guestName} para Valeria`,
      html: `<p>¡Hola Valeria! <strong>${guestName}</strong> (${guestEmail}) te ha enviado nuevas fotos de tu fiesta.</p>`,
      attachments: attachments,
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json({ message: 'Fotos enviadas con éxito', data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
