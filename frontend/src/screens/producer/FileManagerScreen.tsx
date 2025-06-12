import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput } from "react-native";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { filesAPI } from "../../services/api";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Loading from "../../components/Loading";

interface FileItem {
	name: string;
	size: number;
	path: string;
	url: string;
	createdAt: string;
}

interface FolderItem {
	name: string;
	path: string;
}

interface FileManagerProps {
	onSelectFile?: (fileUrl: string) => void;
	currentFolder?: string;
	allowSelection?: boolean;
}

export const FileManagerScreen: React.FC<FileManagerProps> = ({
	onSelectFile,
	currentFolder = "",
	allowSelection = false,
}) => {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [folders, setFolders] = useState<FolderItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [currentPath, setCurrentPath] = useState(currentFolder);
	const [showCreateFolder, setShowCreateFolder] = useState(false);
	const [newFolderName, setNewFolderName] = useState("");

	useEffect(() => {
		loadFiles();
	}, [currentPath]);

	const loadFiles = async () => {
		try {
			setLoading(true);
			const response = await filesAPI.getFiles(currentPath);
			setFiles(response.files);
			setFolders(response.folders);
		} catch (error) {
			console.error("Błąd ładowania plików:", error);
			Alert.alert("Błąd", "Nie udało się załadować plików");
		} finally {
			setLoading(false);
		}
	};

	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 0.8,
				allowsMultipleSelection: false,
			});

			if (!result.canceled && result.assets[0]) {
				await uploadFile(result.assets[0]);
			}
		} catch (error) {
			console.error("Błąd wyboru obrazu:", error);
			Alert.alert("Błąd", "Nie udało się wybrać obrazu");
		}
	};

	const pickDocument = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: ["image/jpeg", "image/jpg", "image/png"],
				copyToCacheDirectory: true,
			});

			if (!result.canceled && result.assets[0]) {
				await uploadFile(result.assets[0]);
			}
		} catch (error) {
			console.error("Błąd wyboru dokumentu:", error);
			Alert.alert("Błąd", "Nie udało się wybrać pliku");
		}
	};

	const uploadFile = async (file: any) => {
		try {
			setUploading(true);

			const fileData = {
				uri: file.uri,
				type: file.mimeType || "image/jpeg",
				name: file.name || "image.jpg",
			};

			await filesAPI.uploadFile(fileData, currentPath);

			Alert.alert("Sukces", "Plik został przesłany pomyślnie");
			loadFiles();
		} catch (error) {
			console.error("Błąd uploadu:", error);
			Alert.alert("Błąd", "Nie udało się przesłać pliku");
		} finally {
			setUploading(false);
		}
	};

	const deleteFile = async (filename: string) => {
		Alert.alert("Potwierdzenie", "Czy na pewno chcesz usunąć ten plik?", [
			{ text: "Anuluj", style: "cancel" },
			{
				text: "Usuń",
				style: "destructive",
				onPress: async () => {
					try {
						await filesAPI.deleteFile(filename, currentPath);
						Alert.alert("Sukces", "Plik został usunięty");
						loadFiles();
					} catch (error) {
						console.error("Błąd usuwania pliku:", error);
						Alert.alert("Błąd", "Nie udało się usunąć pliku");
					}
				},
			},
		]);
	};

	const createFolder = async () => {
		if (!newFolderName.trim()) {
			Alert.alert("Błąd", "Nazwa folderu nie może być pusta");
			return;
		}

		try {
			await filesAPI.createFolder(newFolderName.trim(), currentPath);

			Alert.alert("Sukces", "Folder został utworzony");
			setNewFolderName("");
			setShowCreateFolder(false);
			loadFiles();
		} catch (error) {
			console.error("Błąd tworzenia folderu:", error);
			Alert.alert("Błąd", "Nie udało się utworzyć folderu");
		}
	};

	const deleteFolder = async (folderName: string) => {
		Alert.alert("Potwierdzenie", "Czy na pewno chcesz usunąć ten folder? Folder musi być pusty.", [
			{ text: "Anuluj", style: "cancel" },
			{
				text: "Usuń",
				style: "destructive",
				onPress: async () => {
					try {
						await filesAPI.deleteFolder(folderName, currentPath);
						Alert.alert("Sukces", "Folder został usunięty");
						loadFiles();
					} catch (error) {
						console.error("Błąd usuwania folderu:", error);
						Alert.alert("Błąd", "Nie udało się usunąć folderu");
					}
				},
			},
		]);
	};

	const navigateToFolder = (folderPath: string) => {
		setCurrentPath(folderPath);
	};

	const navigateUp = () => {
		const pathParts = currentPath.split("/").filter((part) => part);
		pathParts.pop();
		setCurrentPath(pathParts.join("/"));
	};

	const selectFile = (fileUrl: string) => {
		if (allowSelection && onSelectFile) {
			onSelectFile(fileUrl);
		}
	};

	const renderFileItem = ({ item }: { item: FileItem }) => (
		<Card style={{ marginBottom: 10 }}>
			<TouchableOpacity
				onPress={() => selectFile(item.url)}
				style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
			>
				<Image
					source={{ uri: item.url }}
					style={{ width: 50, height: 50, borderRadius: 5, marginRight: 10 }}
					resizeMode="cover"
				/>
				<View style={{ flex: 1 }}>
					<Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
					<Text style={{ color: "#666", fontSize: 12 }}>{(item.size / 1024).toFixed(1)} KB</Text>
					<Text style={{ color: "#666", fontSize: 12 }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
				</View>
				<TouchableOpacity onPress={() => deleteFile(item.name)} style={{ padding: 5 }}>
					<Ionicons name="trash-outline" size={20} color="#ff4444" />
				</TouchableOpacity>
			</TouchableOpacity>
		</Card>
	);

	const renderFolderItem = ({ item }: { item: FolderItem }) => (
		<Card style={{ marginBottom: 10 }}>
			<TouchableOpacity
				onPress={() => navigateToFolder(item.path)}
				style={{ flexDirection: "row", alignItems: "center", padding: 15 }}
			>
				<Ionicons name="folder" size={30} color="#4A90E2" style={{ marginRight: 15 }} />
				<View style={{ flex: 1 }}>
					<Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
				</View>
				<TouchableOpacity onPress={() => deleteFolder(item.name)} style={{ padding: 5 }}>
					<Ionicons name="trash-outline" size={20} color="#ff4444" />
				</TouchableOpacity>
			</TouchableOpacity>
		</Card>
	);

	if (loading) {
		return <Loading />;
	}

	return (
		<View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
			{/* Nawigacja */}
			<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
				{currentPath && (
					<TouchableOpacity onPress={navigateUp} style={{ marginRight: 10 }}>
						<Ionicons name="arrow-back" size={24} color="#4A90E2" />
					</TouchableOpacity>
				)}
				<Text style={{ fontSize: 18, fontWeight: "bold", flex: 1 }}>{currentPath || "Główny folder"}</Text>
			</View>

			{/* Przyciski akcji */}
			<View style={{ flexDirection: "row", marginBottom: 20, gap: 10 }}>
				<Button title="Dodaj zdjęcie" onPress={pickImage} disabled={uploading} style={{ flex: 1 }} />
				<Button title="Wybierz plik" onPress={pickDocument} disabled={uploading} style={{ flex: 1 }} />
				<TouchableOpacity
					onPress={() => setShowCreateFolder(true)}
					style={{
						backgroundColor: "#4A90E2",
						padding: 12,
						borderRadius: 8,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Ionicons name="folder-outline" size={20} color="white" />
				</TouchableOpacity>
			</View>

			{uploading && (
				<View style={{ marginBottom: 20 }}>
					<Loading />
					<Text style={{ textAlign: "center", marginTop: 10 }}>Przesyłanie pliku...</Text>
				</View>
			)}

			{/* Lista folderów i plików */}
			<FlatList
				data={[...folders, ...files]}
				keyExtractor={(item, index) => `${item.name}-${index}`}
				renderItem={({ item }) => {
					if ("path" in item && !("url" in item)) {
						return renderFolderItem({ item: item as FolderItem });
					} else {
						return renderFileItem({ item: item as FileItem });
					}
				}}
				showsVerticalScrollIndicator={false}
			/>

			{/* Modal tworzenia folderu */}
			<Modal
				visible={showCreateFolder}
				transparent
				animationType="slide"
				onRequestClose={() => setShowCreateFolder(false)}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.5)",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View
						style={{
							backgroundColor: "white",
							padding: 20,
							borderRadius: 10,
							width: "80%",
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>Utwórz nowy folder</Text>
						<TextInput
							value={newFolderName}
							onChangeText={setNewFolderName}
							placeholder="Nazwa folderu"
							style={{
								borderWidth: 1,
								borderColor: "#ddd",
								padding: 10,
								borderRadius: 5,
								marginBottom: 15,
							}}
						/>
						<View style={{ flexDirection: "row", gap: 10 }}>
							<Button
								title="Anuluj"
								onPress={() => {
									setShowCreateFolder(false);
									setNewFolderName("");
								}}
								style={{ flex: 1, backgroundColor: "#ccc" }}
							/>
							<Button title="Utwórz" onPress={createFolder} style={{ flex: 1 }} />
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};
