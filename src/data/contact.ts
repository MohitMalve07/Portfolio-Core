export interface ContactChannel {
  id: 'email' | 'linkedin' | 'github';
  label: string;
  href: string;
  external?: boolean;
}

export const LETTERBOX_PLACEMENT = {
  // Placed flush on the stone fireplace mantel ledge (y = 1.409, z = 0.025)
  // directly beside Mantel_Oil_Lantern (x = -1.17, xMin = -1.287) and clear of
  // Fireplace_Mantel_Mug (x = -2.02) and the chimney stones (zMax = -0.089).
  position: [-1.47, 1.409, 0.025] as [number, number, number],
  rotationY: 0.25,
  scale: 0.34,
};

export const CONTACT_CONTENT = {
  title: "Let's Connect!",
  greeting: 'Hey there!',
  paragraphs: [
    "Thanks for exploring my workshop. I'm always interested in connecting with people who enjoy creating games, experimenting with technology and building interesting projects.",
    'Whether you have a job opportunity, collaboration idea or simply want to discuss game development, feel free to reach out.',
  ],
  signature: '— Mohit',
  channels: [
    {
      id: 'email',
      label: 'mohitmalve@gmail.com',
      href: 'mailto:mohitmalve@gmail.com',
      external: false,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mohit-malve/',
      external: true,
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/MohitMalve07',
      external: true,
    },
  ] satisfies ContactChannel[],
};
