import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Calendar,
  GraduationCap,
  Building,
  ChevronDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/hooks/supabase';

type FormField =
  | 'username'
  | 'full_name'
  | 'email'
  | 'password'
  | 'college'
  | 'branch'
  | 'year'
  | 'graduation_year';

type FormData = {
  [key in FormField]: string;
};

const graduationYears = [
  '2024',
  '2025',
  '2026',
  '2027',
  '2028',
  '2029',
  '2030',
];

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    full_name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    year: '',
    graduation_year: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: FormField, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    const requiredFields: FormField[] = [
      'username',
      'full_name',
      'email',
      'password',
      'college',
      'branch',
      'year',
      'graduation_year',
    ];
    const missing = requiredFields.filter(field => !formData[field]);

    if (missing.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.full_name,
            college: formData.college,
            branch: formData.branch,
            year: formData.year,
            graduation_year: formData.graduation_year,
          },
        },
      });

      // ✅ DEBUG LOGS
      console.log('SIGNUP DATA:', data);
      console.log('SIGNUP ERROR:', error);

      if (error) {
        Alert.alert('Signup Failed', error.message);
      } else {
        Alert.alert(
          'Signup Successful',
          'Check your email to confirm your account.'
        );
        router.replace('/auth/login');
      }
    } catch (err) {
      console.log('UNEXPECTED SIGNUP ERROR:', err);
      Alert.alert('Unexpected Error', 'Please try again later.');
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7', '#C084FC']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeEmoji}>🎓</Text>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>Join the college community</Text>
            </View>

            <View style={styles.formContainer}>
              <FormInput
                icon={<User />}
                placeholder="Username"
                value={formData.username}
                onChange={(val: string) => updateField('username', val)}
              />

              <FormInput
                icon={<User />}
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(val: string) => updateField('full_name', val)}
              />

              <FormInput
                icon={<Mail />}
                placeholder="Email address"
                value={formData.email}
                onChange={(val: string) => updateField('email', val)}
                keyboardType="email-address"
              />

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#8B5CF6" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={val => updateField('password', val)}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#8B5CF6" />
                    ) : (
                      <Eye size={18} color="#8B5CF6" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <FormInput
                icon={<Building />}
                placeholder="College Name"
                value={formData.college}
                onChange={(val: string) => updateField('college', val)}
              />

              <FormInput
                icon={<GraduationCap />}
                placeholder="Branch (e.g., CSE)"
                value={formData.branch}
                onChange={(val: string) => updateField('branch', val)}
              />

              <FormInput
                icon={<Calendar />}
                placeholder="Current Year (e.g., 2nd Year)"
                value={formData.year}
                onChange={(val: string) => updateField('year', val)}
              />

              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.inputWrapper}
                  onPress={() => setShowYearPicker(!showYearPicker)}
                >
                  <Calendar
                    size={18}
                    color="#8B5CF6"
                    style={styles.inputIcon}
                  />
                  <Text
                    style={[
                      styles.input,
                      styles.dropdownText,
                      !formData.graduation_year && styles.placeholder,
                    ]}
                  >
                    {formData.graduation_year || 'Year of Graduation'}
                  </Text>
                  <ChevronDown size={18} color="#8B5CF6" />
                </TouchableOpacity>

                {showYearPicker && (
                  <View style={styles.dropdown}>
                    {graduationYears.map(year => (
                      <TouchableOpacity
                        key={year}
                        style={styles.dropdownItem}
                        onPress={() => {
                          updateField('graduation_year', year);
                          setShowYearPicker(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  isLoading && styles.signupButtonDisabled,
                ]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8FAFC']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.signupButtonText}>
                    {isLoading ? 'Creating Account...' : 'Register'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

type FormInputProps = {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
};

const FormInput: React.FC<FormInputProps> = ({
  icon,
  placeholder,
  value,
  onChange,
  keyboardType = 'default',
}) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputWrapper}>
      {icon}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#9333EA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  formContainer: {
    marginTop: 20,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  passwordInput: {
    paddingRight: 32,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111827',
  },
  signupButton: {
    marginTop: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  loginPrompt: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginPromptText: {
    color: '#6B7280',
  },
  loginLink: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
});
