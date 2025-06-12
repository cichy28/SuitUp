import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";
import Loading from "./Loading";

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

interface ImagePickerModalProps {
	visible: boolean;
	onClose: () => void;
	onSelectImage: (imageUrl: string) => void;
	title?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
	visible,
	onClose,
	onSelectImage,
	title = "Wybierz obrazek",
}) => {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [folders, setFolders] = useState<FolderItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPath, setCurrentPath] = useState("");

	useEffect(() => {
		if (visible) {
			loadFiles();
		}
	}, [visible, currentPath]);

	const loadFiles = async () => {
		try {
			setLoading(true);
			const response = await api.get("/files", {
				params: { folder: currentPath },
			});
			setFiles(response.data.files);
			setFolders(response.data.folders);
		} catch (error) {
			console.error("Błąd ładowania plików:", error);
		} finally {
			setLoading(false);
		}
	};

	const navigateToFolder = (folderPath: string) => {
		setCurrentPath(folderPath);
	};

	const navigateUp = () => {
		const pathParts = currentPath.split("/").filter((part) => part);
		pathParts.pop();
		setCurrentPath(pathParts.join("/"));
	};

	const selectImage = (imageUrl: string) => {
		onSelectImage(imageUrl);
		onClose();
	};

	const renderFileItem = ({ item }: { item: FileItem }) => (
		<TouchableOpacity
			onPress={() => selectImage(item.url)}
			style={{
				width: "48%",
				marginBottom: 10,
				backgroundColor: "white",
				borderRadius: 8,
				overflow: "hidden",
				elevation: 2,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.2,
				shadowRadius: 2,
			}}
		>
			<Image source={{ uri: item.url }} style={{ width: "100%", height: 120 }} resizeMode="cover" />
			<View style={{ padding: 8 }}>
				<Text style={{ fontSize: 12, fontWeight: "bold" }} numberOfLines={1}>
					{item.name}
				</Text>
				<Text style={{ fontSize: 10, color: "#666" }}>{(item.size / 1024).toFixed(1)} KB</Text>
			</View>
		</TouchableOpacity>
	);

	const renderFolderItem = ({ item }: { item: FolderItem }) => (
		<TouchableOpacity
			onPress={() => navigateToFolder(item.path)}
			style={{
				width: "48%",
				marginBottom: 10,
				backgroundColor: "white",
				borderRadius: 8,
				padding: 15,
				alignItems: "center",
				elevation: 2,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.2,
				shadowRadius: 2,
			}}
		>
			<Ionicons name="folder" size={40} color="#4A90E2" />
			<Text style={{ fontSize: 12, fontWeight: "bold", marginTop: 5, textAlign: "center" }}>{item.name}</Text>
		</TouchableOpacity>
	);

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={onClose}>
			<View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
				{/* Header */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						padding: 20,
						backgroundColor: "white",
						borderBottomWidth: 1,
						borderBottomColor: "#eee",
					}}
				>
					<TouchableOpacity onPress={onClose} style={{ marginRight: 15 }}>
						<Ionicons name="close" size={24} color="#333" />
					</TouchableOpacity>
					<Text style={{ fontSize: 18, fontWeight: "bold", flex: 1 }}>{title}</Text>
				</View>

				{/* Nawigacja */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						padding: 15,
						backgroundColor: "white",
						borderBottomWidth: 1,
						borderBottomColor: "#eee",
					}}
				>
					{currentPath && (
						<TouchableOpacity onPress={navigateUp} style={{ marginRight: 10 }}>
							<Ionicons name="arrow-back" size={20} color="#4A90E2" />
						</TouchableOpacity>
					)}
					<Text style={{ fontSize: 16, color: "#666" }}>{currentPath || "Główny folder"}</Text>
				</View>

				{/* Zawartość */}
				<View style={{ flex: 1, padding: 15 }}>
					{loading ? (
						<Loading />
					) : (
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
							numColumns={2}
							columnWrapperStyle={{ justifyContent: "space-between" }}
							showsVerticalScrollIndicator={false}
						/>
					)}
				</View>
			</View>
		</Modal>
	);
};
