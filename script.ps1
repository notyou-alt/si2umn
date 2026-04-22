# ========================
# CREATE DIRECTORIES
# ========================
$dirs = @(
"src/app/api/auth/login",
"src/app/api/auth/register",
"src/app/api/auth/logout",
"src/app/api/auth/me",

"src/app/api/users/[id]",
"src/app/api/news/[id]",
"src/app/api/faq/[id]",
"src/app/api/testimonies/[id]",

"src/app/api/lecturers/[id]/publications",
"src/app/api/publications/[id]/authors",
"src/app/api/sync/[lecturerId]",

"src/app/api/documents/[id]",
"src/app/api/sections/[id]",
"src/app/api/contents/[id]",
"src/app/api/curriculum/[id]",

"src/app/api/upload/image",
"src/app/api/upload/file",

"src/lib",
"src/services",
"src/repositories",
"src/validations",
"src/middlewares",
"src/types",
"src/constants"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# ========================
# CREATE FILES
# ========================
$files = @(
# AUTH
"src/app/api/auth/login/route.ts",
"src/app/api/auth/register/route.ts",
"src/app/api/auth/logout/route.ts",
"src/app/api/auth/me/route.ts",

# USERS
"src/app/api/users/route.ts",
"src/app/api/users/[id]/route.ts",

# NEWS
"src/app/api/news/route.ts",
"src/app/api/news/[id]/route.ts",

# FAQ
"src/app/api/faq/route.ts",
"src/app/api/faq/[id]/route.ts",

# TESTIMONIES
"src/app/api/testimonies/route.ts",
"src/app/api/testimonies/[id]/route.ts",

# LECTURERS
"src/app/api/lecturers/route.ts",
"src/app/api/lecturers/[id]/route.ts",
"src/app/api/lecturers/[id]/publications/route.ts",

# PUBLICATIONS
"src/app/api/publications/route.ts",
"src/app/api/publications/[id]/route.ts",
"src/app/api/publications/[id]/authors/route.ts",

# SYNC
"src/app/api/sync/[lecturerId]/route.ts",

# DOCUMENTS
"src/app/api/documents/route.ts",
"src/app/api/documents/[id]/route.ts",

# SECTIONS
"src/app/api/sections/route.ts",
"src/app/api/sections/[id]/route.ts",

# CONTENTS
"src/app/api/contents/route.ts",
"src/app/api/contents/[id]/route.ts",

# CURRICULUM
"src/app/api/curriculum/route.ts",
"src/app/api/curriculum/[id]/route.ts",

# UPLOAD
"src/app/api/upload/image/route.ts",
"src/app/api/upload/file/route.ts",

# LIB
"src/lib/prisma.ts",
"src/lib/auth.ts",
"src/lib/utils.ts",

# SERVICES
"src/services/auth.service.ts",
"src/services/user.service.ts",
"src/services/news.service.ts",
"src/services/lecturer.service.ts",
"src/services/publication.service.ts",
"src/services/sync.service.ts",

# REPOSITORIES
"src/repositories/user.repository.ts",
"src/repositories/news.repository.ts",
"src/repositories/publication.repository.ts",
"src/repositories/lecturer.repository.ts",

# VALIDATIONS
"src/validations/auth.validation.ts",
"src/validations/user.validation.ts",
"src/validations/news.validation.ts",
"src/validations/publication.validation.ts",

# MIDDLEWARES
"src/middlewares/auth.middleware.ts",
"src/middlewares/role.middleware.ts",
"src/middlewares/error.middleware.ts",

# TYPES
"src/types/user.type.ts",
"src/types/api.type.ts",
"src/types/publication.type.ts",

# CONSTANTS
"src/constants/role.ts",
"src/constants/status.ts"
)

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
    }
}

Write-Host "✅ Folder & file structure berhasil dibuat!"