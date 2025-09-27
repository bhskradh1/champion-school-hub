# Champion School Hub

A modern, full-stack school management system built with React, TypeScript, and Supabase. This application provides a comprehensive platform for managing school events, notices, gallery, results, leadership information, and more.

## 🚀 Features

### Public Features
- **Home Page**: Welcome banner and school information
- **About**: School history and mission
- **Events**: School events and activities
- **Notices**: Important announcements and updates
- **Gallery**: Photo gallery of school activities
- **Results**: Academic results and achievements
- **Leadership**: School leadership and staff information
- **Contact**: Contact form for inquiries

### Admin Features
- **Dashboard**: Overview of all school data with statistics
- **Event Management**: Create, edit, and manage school events
- **Notice Management**: Publish and manage school notices
- **Gallery Management**: Upload and organize school photos
- **Results Management**: Upload and manage academic results
- **Leadership Management**: Manage school leadership information
- **Message Management**: View and respond to contact messages
- **Password Management**: Secure password change functionality
- **Authentication**: Secure admin login system

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router
- **State Management**: React Context API
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/champion-school-hub.git
   cd champion-school-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- **profiles**: User profiles and roles
- **events**: School events and activities
- **notices**: School announcements
- **gallery**: Photo gallery items
- **results**: Academic results
- **leadership**: School leadership information
- **contact_messages**: Contact form submissions

## 🔐 Authentication

- **Admin Access**: Restricted to authorized email addresses
- **Role-based Access**: Super admin and admin roles
- **Secure Authentication**: Supabase Auth with JWT tokens
- **Password Management**: Secure password change functionality

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional interface
- **Dark/Light Mode**: Theme support
- **Accessibility**: WCAG compliant components
- **Loading States**: Smooth user experience
- **Error Handling**: Comprehensive error management

## 📱 Admin Panel Features

### Dashboard
- Real-time statistics
- Quick action buttons
- Activity overview

### Content Management
- **Events**: Full CRUD operations with image uploads
- **Notices**: Rich text notices with file attachments
- **Gallery**: Image upload and organization
- **Results**: File upload and categorization
- **Leadership**: Team member management

### Security
- **Password Change**: Secure password update functionality
- **Session Management**: Automatic token refresh
- **Access Control**: Role-based permissions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist` folder to your hosting provider
3. Configure environment variables

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── admin/         # Admin-specific components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   └── public/         # Public pages
└── assets/             # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the icon library

## 📞 Support

For support, email support@championschool.com or create an issue in this repository.

---

**Champion School Hub** - Empowering education through technology 🎓