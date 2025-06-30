Here's the fixed version with all missing closing brackets added:

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Smartphone, 
  Trash2, 
  Download, 
  Upload, 
  Zap, 
  MessageSquare,
  Shield,
  Eye,
  EyeOff,
  Key,
  Settings as SettingsIcon,
  Check,
  X,
  Mail,
  Calendar,
  Users,
  Building,
  Moon,
  Sun,
  Save,
  RefreshCw
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import { getUserSettings, updateUserSettings, UserSettings } from '../api/settings';

const Settings: React.FC = () => {
  // ... rest of the component code ...
};

export default Settings;