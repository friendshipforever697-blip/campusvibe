import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Download, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';

const branches = ['CSE', 'ECE', 'Mechanical', 'Civil', 'Chemical', 'Electrical'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const semesters = ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'];
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'Digital Electronics'];

const allNotes = [
  {
    id: 1,
    title: 'Data Structures and Algorithms - Complete Notes',
    branch: 'CSE',
    year: '2nd Year',
    semester: '3rd Sem',
    subject: 'Data Structures',
    uploadedBy: 'Rahul Sharma',
    downloads: 1245,
    pages: 89,
    size: '2.4 MB',
    uploadDate: '2024-02-15',
  },
  {
    id: 2,
    title: 'Digital Electronics - Unit 1 to 5',
    branch: 'ECE',
    year: '2nd Year',
    semester: '4th Sem',
    subject: 'Digital Electronics',
    uploadedBy: 'Priya Patel',
    downloads: 867,
    pages: 156,
    size: '3.2 MB',
    uploadDate: '2024-02-10',
  },
  {
    id: 3,
    title: 'Thermodynamics - Theory + Numericals',
    branch: 'Mechanical',
    year: '2nd Year',
    semester: '3rd Sem',
    subject: 'Thermodynamics',
    uploadedBy: 'Arjun Singh',
    downloads: 592,
    pages: 78,
    size: '1.8 MB',
    uploadDate: '2024-02-08',
  },
  {
    id: 4,
    title: 'Engineering Mathematics - 3',
    branch: 'CSE',
    year: '2nd Year',
    semester: '3rd Sem',
    subject: 'Mathematics',
    uploadedBy: 'Sneha Gupta',
    downloads: 1456,
    pages: 134,
    size: '4.1 MB',
    uploadDate: '2024-02-05',
  },
];

export default function NotesPage() {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(allNotes);

  const filterNotes = () => {
    let filtered = allNotes;
    
    if (selectedBranch) {
      filtered = filtered.filter(note => note.branch === selectedBranch);
    }
    if (selectedYear) {
      filtered = filtered.filter(note => note.year === selectedYear);
    }
    if (selectedSemester) {
      filtered = filtered.filter(note => note.semester === selectedSemester);
    }
    if (selectedSubject) {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }
    
    setFilteredNotes(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 Study Notes</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filter Notes</Text>
          
          <View style={styles.dropdownsContainer}>
            <View style={styles.dropdownRow}>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownLabel}>Branch</Text>
                <TouchableOpacity style={styles.dropdownButton}>
                  <Text style={styles.dropdownButtonText}>
                    {selectedBranch || 'All Branches'}
                  </Text>
                  <ChevronDown size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dropdown}>
                <Text style={styles.dropdownLabel}>Year</Text>
                <TouchableOpacity style={styles.dropdownButton}>
                  <Text style={styles.dropdownButtonText}>
                    {selectedYear || 'All Years'}
                  </Text>
                  <ChevronDown size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dropdownRow}>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownLabel}>Semester</Text>
                <TouchableOpacity style={styles.dropdownButton}>
                  <Text style={styles.dropdownButtonText}>
                    {selectedSemester || 'All Semesters'}
                  </Text>
                  <ChevronDown size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dropdown}>
                <Text style={styles.dropdownLabel}>Subject</Text>
                <TouchableOpacity style={styles.dropdownButton}>
                  <Text style={styles.dropdownButtonText}>
                    {selectedSubject || 'All Subjects'}
                  </Text>
                  <ChevronDown size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.filterButton} onPress={filterNotes}>
            <Text style={styles.filterButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Notes List */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Available Notes ({filteredNotes.length})</Text>
          
          {filteredNotes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <View style={styles.noteIcon}>
                  <FileText size={24} color="#4F46E5" />
                </View>
                <View style={styles.noteInfo}>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <Text style={styles.noteDetails}>
                    {note.branch} • {note.year} • {note.semester}
                  </Text>
                  <Text style={styles.noteSubject}>{note.subject}</Text>
                </View>
              </View>

              <View style={styles.noteStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statText}>📄 {note.pages} pages</Text>
                  <Text style={styles.statText}>💾 {note.size}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statText}>👤 {note.uploadedBy}</Text>
                  <Text style={styles.statText}>⬇️ {note.downloads} downloads</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.downloadButton}>
                <Download size={16} color="#FFFFFF" />
                <Text style={styles.downloadButtonText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Upload Note */}
        <View style={styles.uploadNote}>
          <Text style={styles.uploadNoteText}>
            💡 Want to share your notes? Go to the Upload tab to contribute!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filtersContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  dropdownsContainer: {
    marginBottom: 16,
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dropdown: {
    flex: 1,
    marginHorizontal: 4,
  },
  dropdownLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 6,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  filterButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  noteHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  noteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
    lineHeight: 18,
  },
  noteDetails: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  noteSubject: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#4F46E5',
  },
  noteStats: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  statText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
  },
  downloadButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  uploadNote: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  uploadNoteText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4F46E5',
    textAlign: 'center',
    lineHeight: 18,
  },
});