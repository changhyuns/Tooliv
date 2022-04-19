package com.tooliv.server.domain.workspace.application;

import com.tooliv.server.domain.user.domain.User;
import com.tooliv.server.domain.user.domain.repository.UserRepository;
import com.tooliv.server.domain.workspace.application.dto.request.ModifyWorkspaceRequestDTO;
import com.tooliv.server.domain.workspace.application.dto.request.RegisterWorkspaceRequestDTO;
import com.tooliv.server.domain.workspace.domain.Workspace;
import com.tooliv.server.domain.workspace.domain.repository.WorkspaceRepository;
import com.tooliv.server.global.security.util.JwtAuthenticationProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements  WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    private final UserRepository userRepository;

    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    @Transactional
    @Override
    public Integer registerWorkspace(String accessToken, RegisterWorkspaceRequestDTO registerWorkspaceRequestDTO) {

        User owner = getUserFromAccessToken(accessToken);
        LocalDateTime now = LocalDateTime.now();

        boolean existWorkspace = workspaceRepository.existsByNameAndDeletedAtBefore(registerWorkspaceRequestDTO.getName(), now);
        if (existWorkspace)
            return 409;

        Workspace workspace = Workspace.builder()
                .name(registerWorkspaceRequestDTO.getName())
                .createdAt(now)
                .user(owner)
                .build();

        workspaceRepository.save(workspace);
        return 201;
    }

    @Transactional
    @Override
    public Integer modifyWorkspace(String accessToken, ModifyWorkspaceRequestDTO modifyWorkspaceRequestDTO) {
        Workspace workspace = workspaceRepository.findById(modifyWorkspaceRequestDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 워크스페이스를 찾을 수 없습니다."));
        User owner = getUserFromAccessToken(accessToken);
        if(!owner.equals(workspace.getUser()))
            return 409;

        workspace.modifyWorkspace(modifyWorkspaceRequestDTO.getName());
        workspaceRepository.save(workspace);
        return 200;
    }

    @Transactional
    @Override
    public Integer deleteWorkspace(String workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 워크스페이스를 찾을 수 없습니다."));
        workspace.deleteWorkspace();
        workspaceRepository.save(workspace);
        return 200;
    }

    public User getUserFromAccessToken(String accessToken) {
        String token = accessToken.split(" ")[1];
        String userEmail = jwtAuthenticationProvider.getEmail(token);

        return userRepository.findByEmailAndDeletedAt(userEmail, LocalDateTime.now())
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다."));
    }
}
