import React, { useState, useEffect } from "react";

const InscriptionPage = () => {
    const [activeTab, setActiveTab] = useState("Description");
    const [selectedImage, setSelectedImage] = useState(6);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const images = [
        {
            id: 1,
            src: "https://images.pexels.com/photos/28961402/pexels-photo-28961402.jpeg",
            alt: "Licchavi Inscription 1",
        },
        {
            id: 2,
            src: "https://images.pexels.com/photos/29039549/pexels-photo-29039549.jpeg",
            alt: "Licchavi Inscription 2",
        },
        {
            id: 3,
            src: "https://images.pexels.com/photos/1819713/pexels-photo-1819713.jpeg",
            alt: "Licchavi Inscription 3",
        },
        {
            id: 4,
            src: "https://images.pexels.com/photos/13700906/pexels-photo-13700906.jpeg",
            alt: "Licchavi Inscription 4",
        },
        {
            id: 5,
            src: "https://images.pexels.com/photos/736220/pexels-photo-736220.jpeg",
            alt: "Licchavi Inscription 5",
        },
        {
            id: 6,
            src: "https://images.pexels.com/photos/1651332/pexels-photo-1651332.jpeg",
            alt: "Licchavi Inscription 6",
        },
    ];

    const videoSrc = "https://www.w3schools.com/html/mov_bbb.mp4";
    const videoPoster =
        "https://images.pexels.com/photos/28961402/pexels-photo-28961402.jpeg";

    const tabs = [
        { id: "Description", icon: "📄" },
        { id: "Background", icon: "🏛️" },
        { id: "Text", icon: "📜" },
        { id: "Translation", icon: "🌐" },
        { id: "References", icon: "📚" },
        { id: "Glossary", icon: "📖" },
    ];

    const inscriptionDetails = {
        Description: {
            title: "Inscription Details",
            content: [
                {
                    label: "Title",
                    value: "A Licchavi Inscription from Tebahal",
                },
                { label: "INSN ID", value: "INSN 00002", highlight: true },
                {
                    label: "Material",
                    value: "Stone (on jaladroṇī, its surface now painted white)",
                },
                {
                    label: "Location",
                    value: "Tebahal (Pracaṇḍaviravihāra, Rājakīrtivihāra, Bandhudattavihāra), Kathmandu",
                },
                {
                    label: "Period",
                    value: "Licchavi period (based on palaeographical features)",
                },
                { label: "Script", value: "Licchavi" },
                { label: "Language", value: "Sanskrit" },
                {
                    label: "Dimensions",
                    value: "3 (L) x 24 (W) cm (writing area)",
                },
                { label: "Condition", value: "Good", status: "good" },
                { label: "Access", value: "Public", status: "public" },
            ],
        },
        Background: {
            title: "Historical Background",
            content:
                "The Licchavi period (c. 400-750 CE) represents a golden age in Nepalese history. This inscription from Tebahal provides crucial evidence of early state formation, administrative systems, and religious patronage during this era. The inscription was discovered during restoration work at the Pracaṇḍaviravihāra complex in 2018.",
        },
        Text: {
            title: "Epigraphic Text",
            content:
                "१. ॐ स्वस्ति श्रीमान महाराजाधिराज परमभट्टारक पार्थिवेन्द्र श्रीमान् जयदेवदेव पादानुद्यता \n२. श्री तेबाहलस्य प्रचण्डवीरविहारे राजकीर्तिविहारे बन्धुदत्तविहारे च \n३. जलद्रोणी प्रतिष्ठापिता सर्वसत्वोपकारार्थम् \n४. संवत् ५२३ चैत्रशुक्लपञ्चम्याम् तिथौ रोहिणीनक्षत्रे",
        },
        Translation: {
            title: "English Translation",
            content:
                "Om! Prosperity! His Majesty the Great King, the Supreme Lord, the Paramount Sovereign, His Majesty Jayadevadeva, whose feet are honored, has established this water-trough (jaladroṇī) at the Pracaṇḍavīra Monastery, the Rājakīrti Monastery, and the Bandhudatta Monastery of Tebahal for the benefit of all beings. In the year 523, on the fifth day of the bright fortnight of Chaitra, under the Rohiṇī constellation.",
        },
        References: {
            title: "Academic References",
            content: [
                "Vajracharya, D. (2020). 'New Licchavi Inscriptions from the Kathmandu Valley', Journal of Nepalese Studies, 45(2), pp. 112-130.",
                "Sharma, R. (2019). 'Epigraphic Records of Early Nepal', Archaeological Survey of Nepal.",
                "Pant, M. R. (2018). 'The Licchavi Inscriptions: A Comprehensive Study', Tribhuvan University Press.",
                "Regmi, D. R. (1966). 'Medieval Nepal, Part IV: Inscriptions', Firma K.L. Mukhopadhyay.",
            ],
        },
        Glossary: {
            title: "Technical Terms",
            content: [
                {
                    term: "Jaladroṇī",
                    definition: "A stone water-trough used for ritual purposes",
                },
                {
                    term: "Licchavi Script",
                    definition:
                        "Early Brahmi-derived script used in Nepal (4th-8th century CE)",
                },
                {
                    term: "Vihāra",
                    definition: "Buddhist monastery or monastic complex",
                },
                {
                    term: "Parambhattaraka",
                    definition: "Supreme title meaning 'paramount sovereign'",
                },
                {
                    term: "Rohiṇī",
                    definition: "A lunar mansion in Hindu astrology",
                },
            ],
        },
    };

    const handlePrevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide((prev) => prev - 1);
            setSelectedImage(currentSlide);
        }
    };

    const handleNextSlide = () => {
        if (currentSlide < images.length - 1) {
            setCurrentSlide((prev) => prev + 1);
            setSelectedImage(currentSlide + 2);
        }
    };

    const handleThumbnailClick = (index) => {
        setSelectedImage(index + 1);
        // Ensure the clicked thumbnail is visible in swiper
        if (index > currentSlide + 2) {
            setCurrentSlide(index - 2);
        } else if (index < currentSlide) {
            setCurrentSlide(index);
        }
    };

    useEffect(() => {
        // Reset loading state when image changes
        setImageLoading(true);
    }, [selectedImage]);

    const handleVideoPlay = () => {
        setIsVideoPlaying(true);
    };

    const handleVideoPause = () => {
        setIsVideoPlaying(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
                <img
                    alt="Licchavi Inscription"
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    src="https://images.pexels.com/photos/28961402/pexels-photo-28961402.jpeg"
                    loading="eager"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 drop-shadow-lg">
                        A Licchavi Inscription from Tebahal
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Image Gallery Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Gallery
                        </h2>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                                {selectedImage} of {images.length} images
                            </span>
                        </div>
                    </div>

                    {/* Thumbnail Swiper */}
                    <div className="relative mb-8">
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-300 ease-out"
                                style={{
                                    transform: `translateX(-${currentSlide * 20}%)`,
                                }}
                            >
                                {images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className="flex-shrink-0 w-1/5 px-2 cursor-pointer group"
                                        onClick={() =>
                                            handleThumbnailClick(index)
                                        }
                                    >
                                        <div
                                            className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                                                selectedImage === image.id
                                                    ? "ring-4 ring-blue-500 shadow-xl transform scale-105"
                                                    : "ring-2 ring-gray-200 hover:ring-gray-300"
                                            }`}
                                        >
                                            <img
                                                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                                                alt={image.alt}
                                                src={image.src}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePrevSlide}
                            disabled={currentSlide === 0}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                                currentSlide === 0
                                    ? "opacity-30 cursor-not-allowed"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <svg
                                className="w-5 h-5 text-gray-800"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <button
                            onClick={handleNextSlide}
                            disabled={currentSlide >= images.length - 5}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                                currentSlide >= images.length - 5
                                    ? "opacity-30 cursor-not-allowed"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <svg
                                className="w-5 h-5 text-gray-800"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Main Image and Video Grid */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Selected Image */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="relative">
                                {imageLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                                <img
                                    alt="Selected inscription detail"
                                    className={`w-full h-[400px] object-contain transition-opacity duration-300 ${
                                        imageLoading
                                            ? "opacity-0"
                                            : "opacity-100"
                                    }`}
                                    src={
                                        images.find(
                                            (img) => img.id === selectedImage,
                                        )?.src
                                    }
                                    onLoad={() => setImageLoading(false)}
                                />

                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full shadow">
                                    {selectedImage} / {images.length}
                                </div>
                            </div>
                        </div>

                        {/* Video */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="relative">
                                <video
                                    src={videoSrc}
                                    controls
                                    poster={videoPoster}
                                    className="w-full h-[400px] object-cover"
                                    onPlay={handleVideoPlay}
                                    onPause={handleVideoPause}
                                >
                                    Your browser does not support the video tag.
                                </video>
                                {!isVideoPlaying && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                            <svg
                                                className="w-8 h-8 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-white font-medium">
                                            Click to play video documentation
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Video Documentation
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    3D scan and epigraphic analysis of the
                                    Tebahal inscription. Duration: 2:45 min.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Tabs */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <div className="flex flex-wrap gap-1 px-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
                                        activeTab === tab.id
                                            ? "text-blue-600"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.id}</span>
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 md:p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            {inscriptionDetails[activeTab].title}
                        </h3>

                        <div className="prose max-w-none">
                            {activeTab === "Description" && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {inscriptionDetails.Description.content.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="border-l-4 border-blue-100 pl-4 py-1"
                                            >
                                                <div className="text-sm text-gray-500 font-medium">
                                                    {item.label}
                                                </div>
                                                <div
                                                    className={`text-lg font-medium mt-1 ${
                                                        item.highlight
                                                            ? "text-blue-600"
                                                            : "text-gray-800"
                                                    }`}
                                                >
                                                    {item.value}
                                                    {item.status && (
                                                        <span
                                                            className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                                                item.status ===
                                                                "good"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-blue-100 text-blue-800"
                                                            }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                            {activeTab === "Background" && (
                                <div className="text-gray-700 leading-relaxed space-y-4">
                                    <p>
                                        {inscriptionDetails.Background.content}
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-500">
                                        <p className="text-sm text-gray-600">
                                            <strong>Significance:</strong> This
                                            inscription is crucial for
                                            understanding the administrative
                                            structure and religious patronage
                                            during the Licchavi period.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Text" && (
                                <div className="space-y-6">
                                    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono whitespace-pre-line leading-loose">
                                        {inscriptionDetails.Text.content}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Copy Text
                                        </span>
                                        <span className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                            </svg>
                                            Download Transcript
                                        </span>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Translation" && (
                                <div className="space-y-4">
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {inscriptionDetails.Translation.content}
                                    </p>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> Translation
                                            by Prof. R. Sharma (2019). The date
                                            corresponds to approximately 446 CE
                                            in the Gregorian calendar.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "References" && (
                                <div className="space-y-4">
                                    {inscriptionDetails.References.content.map(
                                        (ref, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="text-gray-400 text-sm mt-1">
                                                    [{index + 1}]
                                                </span>
                                                <p className="text-gray-700">
                                                    {ref}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                            {activeTab === "Glossary" && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {inscriptionDetails.Glossary.content.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                            >
                                                <h4 className="font-bold text-gray-800 mb-2">
                                                    {item.term}
                                                </h4>
                                                <p className="text-gray-600 text-sm">
                                                    {item.definition}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InscriptionPage;
